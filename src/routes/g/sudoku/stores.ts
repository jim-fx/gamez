import localHistoryStore from "$lib/localHistoryStore";
import localStore from "$lib/localStore";
import { writable, type Writable } from "svelte/store";
import { genSudoku } from "./utils";

export const view: Writable<'game' | 'settings' | 'statistics'> = writable('game');

export const games = writable([]);

export const settings = writable({})


export const grid = localStore('sudoku-grid', genSudoku());
export const custom = localHistoryStore<number[]>('sudoku-custom', []);
