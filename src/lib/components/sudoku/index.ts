import Cell from "./Cell.svelte"
import _Grid from "./Grid.svelte"
import { makepuzzle, solvepuzzle } from "./sudoku"

type GridType = typeof _Grid & {
  Cell: typeof Cell
  makepuzzle: typeof makepuzzle
  solvepuzzle: typeof solvepuzzle
}

const Grid = _Grid as GridType
Grid.Cell = Cell
Grid.makepuzzle = makepuzzle
Grid.solvepuzzle = solvepuzzle

export default Grid
