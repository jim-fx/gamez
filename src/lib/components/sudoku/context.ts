import { getContext as _getContext, hasContext as _hasContext, setContext as _setContext } from "svelte";
import type { Readable, Writable } from "svelte/store";

export type Context = {
  activeIndex: Writable<number>,
  hoveredIndex: Writable<number>,
  hoveredValue: Readable<number>,
  getPosition: (index: number) => [number, number],
  getCell: (index: number) => number,
  getCellIndex: (row: number, col: number) => number,
  setCell: (index: number, value: number) => void,
  toggleActive: (index: number) => void,
}

type getContext = (key: string) => Context;
type setContext = (key: string, value: Context) => void;
type hasContext = (key: string) => boolean;

export const setContext = _setContext as setContext;
export const getContext = _getContext as getContext;
export const hasContext = _hasContext as hasContext;

