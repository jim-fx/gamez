import { get, writable } from "svelte/store";

export default function historyStore<T>(initialValue: T) {

  const store = writable(initialValue);
  const { subscribe, set: _set, update: _update } = store;

  const activeIndex = writable(0);
  let history: T[] = [initialValue];

  const historyAmount = 100;

  function addValue(v: T) {
    const index = get(activeIndex) + 1;
    if (JSON.stringify(history[index - 1]) !== JSON.stringify(v)) {
      if (index < history.length - 1) {
        history = [...history.splice(0, index), v];
      } else {
        history = [...history.splice(-historyAmount), v];
      }
      activeIndex.set(history.length - 1);
      _set(v);
    }
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
