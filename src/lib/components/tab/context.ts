import { getContext as _getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";

type TabContext = {
  contentStyle: string;
  registerTab(value?: string): Writable<number>;
  unregisterTab(id: number): void;
  setActiveTab(id: number): void;
  activeTab: Writable<number>;
}

export function createContext(ctx: TabContext) {
  return setContext("tab-context", ctx)
}

export function getContext() {
  return _getContext("tab-context") as TabContext
}
