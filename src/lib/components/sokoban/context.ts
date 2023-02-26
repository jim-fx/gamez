import { getContext as _getContext, hasContext as _hasContext, setContext as _setContext } from "svelte";
import type { Writable } from "svelte/store";

export type Context = {
  balls: Writable<number[]>,
  cells: number[],
  width: number,
  height: number,
  getPosition: (index: number) => [number, number],
  getIndex: (row: number, col: number) => number,
  getCell: (index: number) => boolean | null,
  moveBall: (index: number, direction: number) => void,
  getPossibleMoves: (index: number) => number[],
}

type getContext = (key: string) => Context;
type setContext = (key: string, value: Context) => void;
type hasContext = (key: string) => boolean;

export const setContext = _setContext as setContext;
export const getContext = _getContext as getContext;
export const hasContext = _hasContext as hasContext;


