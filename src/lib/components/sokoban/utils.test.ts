import { expect, test } from 'vitest';
import { compressArray, decompressArray } from "./utils";

test('should work', () => {
  const arr = [0, 5, 1, 2, 4, 7, 0, 3];
  const compressed = compressArray(arr);
  const decompressed = decompressArray(compressed);
  expect(decompressed).toEqual(arr)
})
