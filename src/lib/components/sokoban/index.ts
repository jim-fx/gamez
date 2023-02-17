import _Ball from "./Ball.svelte";
import _Cell from "./Cell.svelte";
import _Grid from "./Grid.svelte";

type Grid = typeof _Grid & {
  Ball: typeof _Ball;
  Cell: typeof _Cell;
};

const Grid: Grid = _Grid as Grid;

Grid.Ball = _Ball;
Grid.Cell = _Cell;

export default Grid

