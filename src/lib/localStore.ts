import { writable, type Writable } from "svelte/store";

function isStore(v: unknown): v is Writable<unknown> {
  return v !== null && typeof v === "object" && "subscribe" in v && "set" in v;
}

const storeIds: Map<string, ReturnType<typeof createLocalStore>> = new Map();

const HAS_LOCALSTORAGE = "localStorage" in globalThis;

function createLocalStore<T>(key: string, initialValue: T | Writable<T>) {

  const store = isStore(initialValue) ? initialValue : writable(initialValue);

  if (!HAS_LOCALSTORAGE) return store;

  const value = localStorage.getItem(key);
  if (value) {
    store.set(JSON.parse(value));
  }

  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update
  }
}

export default function localStore<T>(key: string, initialValue: T | Writable<T>): Writable<T> {

  if (storeIds.has(key)) return storeIds.get(key) as Writable<T>;

  const store = createLocalStore(key, initialValue)

  storeIds.set(key, store);

  return store

}
