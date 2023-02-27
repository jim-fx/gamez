import type { BoardState } from "./core";

export const colors = [
  "red",
  "lime",
  "yellow",
  "indigo",
  "pink"
]

export const cellSize = 60;

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export const defaultGame: BoardState = {
  balls: [
    {
      start: 5,
      target: 11,
    },
    {
      start: 6,
      target: 10,
    }
  ],
  width: 5,
  height: 5,
  steps: {
    best: 6,
    worst: 10,
  },
  difficulty: 0,
  cells: [
    0, 1, 0, 1, 0,
    1, 1, 1, 1, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 1, 0, 1, 0
  ]
} 
