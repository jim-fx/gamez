import type { BoardState } from "$lib/components/sokoban/core";
import localStore from "$lib/localStore";

export const state = localStore<BoardState>('sokoban-editor-state', {
  width: 5,
  height: 5,
  cells: [],
  balls: [],
  steps: {
    best: 0,
    worst: 0
  },
  difficulty: 0
});
