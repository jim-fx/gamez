import localStore from "$lib/localStore";
import { writable, type Writable } from "svelte/store";

export const activeView: Writable<'map' | 'game'> = localStore('sokoban-editor-view', 'map');

export const dragTarget = writable<{
  type: 'ball' | 'target';
  index: number;
} | null>(null);
