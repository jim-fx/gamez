import { writable, type Writable } from "svelte/store";

function isStore(v: unknown): v is Writable<unknown> {
  return v !== null && typeof v === "object" && "subscribe" in v && "set" in v;
}

const storeIds = new Set();

const HAS_LOCALSTORAGE = "localStorage" in globalThis;

export default function localStore<T>(initialValue: T | Writable<T>, key: string) {

  if (storeIds.has(key)) throw new Error(`A store with the key '${key}' already exists`);
  storeIds.add(key);

  const store = isStore(initialValue) ? initialValue : writable(initialValue);

  if (!HAS_LOCALSTORAGE) return store;

  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  const value = localStorage.getItem(key);
  if (value) {
    store.set(JSON.parse(value));
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update
  }

}
