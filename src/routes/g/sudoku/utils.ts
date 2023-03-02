import { getSudoku } from "sudoku-gen";

export function genSudoku() {
  const d = getSudoku('easy');
  return d.puzzle.split('').map((x) => (x === '-' ? null : parseInt(x)));
}
