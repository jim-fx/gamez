import { genSudoku } from "$lib/components/sudoku";
import localHistoryStore from "$lib/localHistoryStore";
import localStore from "$lib/localStore";
import { compareArrays } from "$lib/utils";
import { get, writable, type Writable } from "svelte/store";

export const view: Writable<'game' | 'settings' | 'statistics'> = writable('game');

export type Game = {
  startedAt: Date,
  endAt?: Date,
  initial: number[],
  final?: number[],
  difficulty: 'easy' | 'medium' | 'hard' | "expert",
}

type Settings = {
  difficulty: 'easy' | 'medium' | 'hard' | "expert"
}

export const games = localStore<Game[]>("sudoku-game-history", []);

export const settings = writable<Settings>({ difficulty: "easy" })

export const currentGame = localStore<Game>("sudoku-current-game", {
  startedAt: new Date(),
  difficulty: get(settings).difficulty,
  initial: genSudoku(get(settings).difficulty)
})

export const custom = localHistoryStore<number[]>('sudoku-custom', []);

export function createNewGame() {
  const _current = { ...get(currentGame), final: get(custom), endAt: new Date() };
  const _settings = get(settings);

  const newGame = {
    difficulty: _settings.difficulty,
    startedAt: new Date(),
    initial: genSudoku(_settings.difficulty)
  }

  custom.set([]);
  currentGame.set(newGame);

  const gameAlreadySaved = get(games).find(g => g.final && compareArrays(g.final, _current.final));
  if (!gameAlreadySaved) {
    games.update((x) => [...x, _current]);
  }

}
