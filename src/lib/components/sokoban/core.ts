import { compressArray, decompressArray } from "./utils";

export type Ball = {
  start: number,
  target: number
}

enum CellState {
  EMPTY = 0,
  NORMAL = 1,
}

export type BoardState = {
  balls: Ball[],
  steps: {
    best: number,
    worst: number,
  },
  difficulty: number;
  width: number,
  height: number,
  cells: number[]
}

// [0812] -> [0000000011]
export function decompressCells(input: number[]): number[] {
  const output: number[] = [];

  for (let i = 0; i < input.length; i++) {

    const cellState = input[i];

    if (cellState === CellState.EMPTY) {
      const amountOfEmptyCells = input[i + 1];
      output.push(...Array(amountOfEmptyCells).fill(CellState.EMPTY));
      i++;
    } else if (cellState === CellState.NORMAL) {
      const amountOfCells = input[i + 1];
      output.push(...Array(amountOfCells).fill(CellState.NORMAL));
      i++;
    } else {
      output.push(cellState);
    }
  }

  return output;
}

// [0000000011] --> [0812]
export function compressCells(input: number[]): number[] {
  const output: number[] = [];
  let last = input[0];
  let amount = 1;
  for (let i = 1; i < input.length; i++) {
    const cellState = input[i];
    if (cellState === last && (cellState === CellState.EMPTY || cellState === CellState.NORMAL)) {
      amount++;
    } else {
      if (last === CellState.EMPTY || last === CellState.NORMAL) {
        output.push(last, amount);
      } else {
        output.push(last)
      }
      last = cellState;
      amount = 1;
    }
  }

  if (last === CellState.EMPTY || last === CellState.NORMAL) {
    output.push(last, amount);
  } else {
    output.push(last)
  }

  return output;
}

function encodeCells(input: BoardState): number[] {

  const output: number[] = Array(input.width * input.height).fill(0);

  for (let i = 0; i < input.cells.length; i++) {
    const v = input.cells[i]
    if (i < input.balls.length) {
      const ball = input.balls[i];
      output[ball.start] = i + 2;
      output[ball.target] = i + 2 + input.balls.length;
    }
    if (v === CellState.NORMAL && output[i] < 2) {
      output[i] = CellState.NORMAL;
    }
  }

  return output;
}

function decodeCells(ballAmount: number, input: number[]): [Ball[], number[]] {

  const balls: Ball[] = [];
  const cells: number[] = []

  for (let i = 0; i < input.length; i++) {

    const v = input[i] - 1;
    cells.push(v === -1 ? CellState.EMPTY : CellState.NORMAL);
    if (v > ballAmount) {
      balls[v - ballAmount - 1] = {
        ...(balls[v - ballAmount - 1] || { start: -1 }),
        target: i
      }
    } else if (v > 0) {
      balls[v - 1] = {
        ...(balls[v - 1] || { target: -1 }),
        start: i
      };
    }

  }

  return [balls, cells]

}

export function encodeSokobanBoard(input: BoardState): string {
  const level = [input.balls.length, input.steps.best, input.steps.worst, input.difficulty, input.width, input.height, ...compressCells(encodeCells(input))];
  return compressArray(level);
}

export function decodeSokobanBoard(levelString: string): BoardState {

  const input = decompressArray(levelString);

  const [ballAmount, bestSteps, worstSteps, difficulty, width, height, ...rest] = input;

  const decompressed = decompressCells(rest);

  const [balls, cells] = decodeCells(ballAmount, decompressed);

  return {
    balls,
    cells,
    steps: {
      best: bestSteps,
      worst: worstSteps,
    },
    difficulty,
    width,
    height
  }

}

