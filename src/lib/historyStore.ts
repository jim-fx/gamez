import { get, writable, type Writable } from "svelte/store";

function isStore(v: unknown): v is Writable<unknown> {
  return v !== null && typeof v === "object" && "subscribe" in v && "set" in v;
}

const HISTORY_AMOUNT = 100;

export default function historyStore<T>(initialValue: T | Writable<T>) {

  const store = isStore(initialValue) ? initialValue : writable(initialValue);
  const { subscribe, set: _set } = store;

  const activeIndex = writable(0);
  let history: T[] = [get(store)];

  function addValue(newValue: T) {
    const currentIndex = get(activeIndex);
    const nextIndex = currentIndex + 1;
    const previousIndex = currentIndex - 1;

    const previousValue = history[previousIndex];
    const currentValue = history[currentIndex]
    const nextValue = history[nextIndex];

    // Return if the new value is the same as the current value
    if (JSON.stringify(currentValue) === JSON.stringify(newValue)) return;

    // If the new value is the same as the next value
    if (nextValue && JSON.stringify(nextValue) === JSON.stringify(newValue)) {
      activeIndex.set(nextIndex);
      _set(nextValue);
      return;
    }

    // If the new value is the same as the previous value
    if (previousValue && JSON.stringify(previousValue) === JSON.stringify(newValue)) {
      activeIndex.set(previousIndex);
      _set(previousValue)
      return;
    }

    if (nextIndex <= history.length - 1) {
      history = [...history.splice(0, nextIndex), newValue].splice(-HISTORY_AMOUNT);
    } else {
      history = [...history.splice(-HISTORY_AMOUNT), newValue];
    }
    activeIndex.set(history.length - 1);
    _set(newValue);
  }

  if (isStore(initialValue)) {
    initialValue.subscribe((newValue) => {
      const currentValue = get(store);
      if (JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
        addValue(newValue)
      }
    });
  }

  function set(value: T) {
    addValue(value);
  }

  function update(updateFunc: (value: T) => T) {
    const result = updateFunc(get(store));
    addValue(result);
  }

  function undo() {
    const index = get(activeIndex) - 1;
    if (index < 0) return;
    _set(history[index]);
    activeIndex.set(index);
  }

  function redo() {
    const index = get(activeIndex) + 1;
    if (index < history.length) {
      _set(history[index]);
      activeIndex.set(index);
    }
  }

  return {
    subscribe,
    set,
    update,
    undo,
    redo,
    activeIndex,
    get history() {
      return [...history]
    }
  }
}