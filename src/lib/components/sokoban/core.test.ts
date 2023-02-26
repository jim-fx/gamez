import { expect, test } from 'vitest';
import { compressCells, decodeSokobanBoard, decompressCells, encodeSokobanBoard } from "./core";

const decompressed1 = [0, 0, 0, 0, 0, 1, 1, 4, 7, 0, 0, 0];
const compressed1 = [0, 5, 1, 2, 4, 7, 0, 3];

const decompressed2 = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
const compressed2 = [0, 8, 1, 2]

const board = {
  balls: [{
    target: 1,
    start: 4
  }, {
    target: 15,
    start: 11
  }],
  steps: {
    best: 4,
    worst: 10,
  },
  difficulty: 0,
  width: 6,
  height: 3,
  cells: [
    0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0
  ]
}

const encodedBoard = [2, 4, 10, 0, 6, 3, 0, 1, 4, 1, 2, 2, 1, 6, 3, 1, 3, 5, 0, 2]

test('compress cells should work', () => {
  expect(compressCells(decompressed1)).toEqual(compressed1)
  expect(compressCells(decompressed2)).toEqual(compressed2)
})

test("decompress cells should work", () => {
  expect(decompressCells(compressed1)).toEqual(decompressed1)
  expect(decompressCells(compressed2)).toEqual(decompressed2)
})

test("should encode board correctly", () => {
  const encoded = encodeSokobanBoard(board);
  expect(encoded).toEqual(encodedBoard)
})

test("should decode board from encoded state", () => {
  const decoded = decodeSokobanBoard(encodedBoard);
  expect(decoded).toEqual(board)
})
