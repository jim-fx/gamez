export const colors = [
  "#FF8F50",
  "#FF4FE3",
  "#534FFF",
  "#4FFFB5",
]

export const cellSize = 80;

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export const defaultGame = {
  balls: [
    6, 5
  ],
  targets: [
    10, 11,
  ],
  grid: [
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    true,
    false,
    true,
    false
  ]
} 
