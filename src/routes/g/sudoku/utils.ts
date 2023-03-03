import { getSudoku } from "sudoku-gen";

export function genSudoku(difficulty: "easy" | "medium" | "hard" | "expert") {
  const d = getSudoku(difficulty);
  return d.puzzle.split('').map((x) => (x === '-' ? 0 : parseInt(x)));
}
