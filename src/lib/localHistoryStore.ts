import { get, type Writable } from "svelte/store";
import historyStore from "./historyStore";
import localStore from "./localStore";

export default function localHistoryStore<T>(key: string, initialValue: T | Writable<T>) {

  const store = localStore<{ activeIndex: number, history: T[] }>("history-" + key + "-history", { activeIndex: 0, history: [] });

  const _s = get(store);

  const history = historyStore(initialValue, { activeIndex: _s.activeIndex, history: _s.history })

  history.subscribe(() => {
    store.set({
      activeIndex: get(history.activeIndex),
      history: history.history
    })
  });

  history.activeIndex.subscribe(() => {
    store.set({
      activeIndex: get(history.activeIndex),
      history: history.history
    })
  })

  return history;

}
