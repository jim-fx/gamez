import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";


import type { BoardState } from "./core";

export function compare<T>(a: T[], b: T[]) {
  for (const i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function arrayToMap<T>(arr: T[]) {
  const map = new Map();
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    map.set(element, index);
  }
  return map;
}

function groupArray<T>(arr: T[], groupSize: number): T[][] {
  const groups: T[][] = [];
  while (arr.length > 0) {
    const g = arr.splice(0, groupSize);
    groups.push(g);
  }
  return groups;
}

export function trimBoardState(b: BoardState): BoardState {

  let emptyRowsTop = 0;
  for (let i = 0; i < b.cells.length; i++) {
    if (b.cells[i] !== 0) break;
    if (i % b.width - 1 === 0) {
      emptyRowsTop++;
    }
  }

  let emptyRowsBottom = 0;
  for (let i = b.cells.length - 1; i >= 0; i--) {
    if (b.cells[i] !== 0) break;
    if (i % b.width - 1 === 0) {
      emptyRowsBottom++;
    }
  }

  let emptyColsLeft = 0;
  for (let x = 0; x < b.width; x++) {
    let _break = false;
    for (let y = 0; y < b.height; y++) {
      if (b.cells[x + y * b.width] !== 0) {
        _break = true;
        break
      };
      if (y === b.height - 1) {
        emptyColsLeft++;
      }
    }
    if (_break) break;
  }

  let emptyColsRight = 0;
  for (let x = b.width - 1; x >= 0; x--) {
    let _break = false;
    for (let y = b.height - 1; y >= 0; y--) {
      if (b.cells[x + y * b.width] !== 0) {
        _break = true;
        break;
      }
      if (y === 0) {
        emptyColsRight++;
      }
    }
    if (_break) break;
  }


  const convertIndex = (i: number) => {
    const x = i % b.width - emptyColsLeft;
    const y = Math.floor(i / b.width) - emptyRowsTop;
    return x + y * (b.width - emptyColsLeft);
  }
  b.balls = b.balls.map((ball) => {
    ball.start = convertIndex(ball.start)
    ball.target = convertIndex(ball.target);
    return ball;
  });
  for (let i = 0; i < emptyRowsTop; i++) {
    for (let j = 0; j < b.width; j++) {
      b.cells[j + i * b.width] = -1;
    }
  }

  for (let i = 0; i < emptyRowsBottom; i++) {
    for (let j = 0; j < b.width; j++) {
      b.cells[j + (b.height - 1 - i) * b.width] = -1;
    }
  }

  for (let i = 0; i < emptyColsLeft; i++) {
    for (let j = 0; j < b.height; j++) {
      b.cells[i + j * b.width] = -1;
    }
  }

  for (let i = 0; i < emptyColsRight; i++) {
    for (let j = 0; j < b.height; j++) {
      b.cells[b.width - 1 - i + j * b.width] = -1;
    }
  }

  const g = groupArray([...b.cells], b.width)
  console.table(g);
  b.width -= emptyColsLeft + emptyColsRight;
  b.height -= emptyRowsTop + emptyRowsBottom;
  b.cells = b.cells.filter((c) => c !== -1);

  b.width = Math.max(1, b.width);
  b.height = Math.max(1, b.height);

  console.log("Balls", [...b.balls]);

  return b;

}

export function calculateRating(steps: number, bestSteps: number, worstSteps: number) {
  const alpha = Math.min(Math.max((steps - bestSteps) / (worstSteps - bestSteps), 0), 1);
  const rating = 5 - Math.floor(alpha * 4);
  return rating;
}

const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
export function compressArray(arr: number[]) {
  return compressToEncodedURIComponent(arr.map((n) => chars[n]).join(""));
}

export function decompressArray(str: string) {
  return decompressFromEncodedURIComponent(str)?.split("").map((c: string) => chars.indexOf(c));
}
