import localStore from "$lib/localStore";
import type { Writable } from "svelte/store";

export const activeView: Writable<'map' | 'game'> = localStore('sokoban-editor-view', 'map');
