// Sudoku Generator and Solver for node.js
// Copyright (c) 2011 Blagovest Dachev.  All rights reserved.
//
// This is a port of David Bau's python  implementation:
// http://davidbau.com/archives/2006/09/04/sudoku_generator.html
function makeboard(board: (number | null)[]) {
  const puzzle: Cell[] = [];
  const deduced = Array(81).fill(null);
  const order = [...Array(81).keys()];
  shuffleArray(order);

  for (let i = 0; i < order.length; i++) {
    const pos = order[i];

    if (deduced[pos] === null) {
      puzzle.push({
        pos: pos,
        num: board[pos]
      });
      deduced[pos] = board[pos];
      deduce(deduced);
    }
  }

  shuffleArray(puzzle);

  for (let i = puzzle.length - 1; i >= 0; i--) {
    const e = puzzle[i];
    removeElement(puzzle, i);
    const rating = checkpuzzle(boardforentries(puzzle), board);

    if (rating === -1) {
      puzzle.push(e);
    }
  }

  return boardforentries(puzzle);
}

export function ratepuzzle(puzzle: number[], samples: number) {
  let total = 0;

  for (let i = 0; i < samples; i++) {
    const tuple = solveboard(puzzle);

    if (tuple.answer === null) {
      return -1;
    }

    total += tuple.state.length;
  }

  return total / samples;
}

export function checkpuzzle(puzzle: number[], board: number[] | null | undefined) {
  if (board === undefined) {
    board = null;
  }

  const tuple1 = solveboard(puzzle);

  if (tuple1.answer === null) {
    return -1;
  }

  if (board != null && !boardmatches(board, tuple1.answer)) {
    return -1;
  }

  const difficulty = tuple1.state.length;
  const tuple2 = solvenext(tuple1.state);

  if (tuple2.answer != null) {
    return -1;
  }

  return difficulty;
}

export function solvepuzzle(board: (number | null)[]) {
  return solveboard(board).answer;
}

function solveboard(original: (number | null)[]) {
  const board = [...original];
  const guesses = deduce(board);

  if (guesses === null) {
    return {
      state: [],
      answer: board
    };
  }

  const track = [{
    guesses: guesses,
    count: 0,
    board: board
  }];
  return solvenext(track);
}

type Guess = {
  guesses: Cell[],
  count: number,
  board: (number | null)[]
}

function solvenext(remembered: Guess[]) {
  while (remembered.length > 0) {
    const tuple1 = remembered.pop();

    if (!tuple1) continue;

    if (tuple1.count >= tuple1.guesses.length) {
      continue;
    }

    remembered.push({
      guesses: tuple1.guesses,
      count: tuple1.count + 1,
      board: tuple1.board
    });
    const workspace = [...tuple1.board];
    const tuple2 = tuple1.guesses[tuple1.count];
    workspace[tuple2.pos] = tuple2.num;
    const guesses = deduce(workspace);

    if (guesses === null) {
      return {
        state: remembered,
        answer: workspace
      };
    }

    remembered.push({
      guesses: guesses,
      count: 0,
      board: workspace
    });
  }

  return {
    state: [],
    answer: null
  };
}

type Cell = {
  pos: number
  num: number | null
}

function deduce(board: (number | null)[]) {
  while (true) {
    let stuck = true;
    let guess = null;
    let count = 0; // fill in any spots determined by direct conflicts

    const tuple1 = figurebits(board);
    let allowed = tuple1.allowed;
    let needed = tuple1.needed;

    for (let pos = 0; pos < 81; pos++) {
      if (board[pos] === null) {
        const numbers = listbits(allowed[pos]);

        if (numbers.length === 0) {
          return [];
        } else if (numbers.length === 1) {
          board[pos] = numbers[0];
          stuck = false;
        } else if (stuck) {
          const t = numbers.map(function(val) {
            return {
              pos: pos,
              num: val
            };
          });
          const tuple2 = pickbetter(guess, count, t);
          guess = tuple2.guess;
          count = tuple2.count;
        }
      }
    }

    if (!stuck) {
      const tuple3 = figurebits(board);
      allowed = tuple3.allowed;
      needed = tuple3.needed;
    } // fill in any spots determined by elimination of other locations


    for (let axis = 0; axis < 3; axis++) {
      for (let x = 0; x < 9; x++) {
        const numbers = listbits(needed[axis * 9 + x]);

        for (let i = 0; i < numbers.length; i++) {
          const n = numbers[i];
          const bit = 1 << n;
          const spots = [];

          for (let y = 0; y < 9; y++) {
            const pos = posfor(x, y, axis);

            if (allowed[pos] & bit) {
              spots.push(pos);
            }
          }

          if (spots.length === 0) {
            return [];
          } else if (spots.length === 1) {
            board[spots[0]] = n;
            stuck = false;
          } else if (stuck) {
            const t = spots.map(function(val) {
              return {
                pos: val,
                num: n
              };
            });
            const tuple4 = pickbetter(guess, count, t);
            guess = tuple4.guess;
            count = tuple4.count;
          }
        }
      }
    }

    if (stuck) {
      if (guess != null) {
        shuffleArray(guess);
      }

      return guess;
    }
  }
}

function figurebits(board: (number | null)[]) {
  const needed = [];
  const allowed: number[] = board.map(function(val) {
    return val === null ? 511 : 0;
  }, []);

  for (let axis = 0; axis < 3; axis++) {
    for (let x = 0; x < 9; x++) {
      const bits = axismissing(board, x, axis);
      needed.push(bits);

      for (let y = 0; y < 9; y++) {
        const pos = posfor(x, y, axis);
        allowed[pos] = allowed[pos] & bits;
      }
    }
  }

  return {
    allowed: allowed,
    needed: needed
  };
}

function posfor(x: number, y: number, axis: number | undefined) {
  if (axis === undefined) {
    axis = 0;
  }

  if (axis === 0) {
    return x * 9 + y;
  } else if (axis === 1) {
    return y * 9 + x;
  }

  return [0, 3, 6, 27, 30, 33, 54, 57, 60][x] + [0, 1, 2, 9, 10, 11, 18, 19, 20][y];
}

function axismissing(board: (number | null)[], x: number, axis: number | undefined) {
  let bits = 0;

  for (let y = 0; y < 9; y++) {
    const e = board[posfor(x, y, axis)];

    if (e != null) {
      bits |= 1 << e;
    }
  }

  return 511 ^ bits;
}

function listbits(bits: number) {
  const list = [];

  for (let y = 0; y < 9; y++) {
    if ((bits & 1 << y) != 0) {
      list.push(y);
    }
  }

  return list;
}


function pickbetter(b: Cell[] | null, c: number, t: Cell[]) {
  if (b === null || t.length < b.length) {
    return {
      guess: t,
      count: 1
    };
  } else if (t.length > b.length) {
    return {
      guess: b,
      count: c
    };
  } else if (randomInt(c) === 0) {
    return {
      guess: t,
      count: c + 1
    };
  }

  return {
    guess: b,
    count: c + 1
  };
}

function boardforentries(entries: Cell[]) {
  const board = Array(81).fill(null);

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    const pos = item.pos;
    const num = item.num;
    board[pos] = num;
  }

  return board;
}

function boardmatches(b1: number[], b2: number[]) {
  for (let i = 0; i < 81; i++) {
    if (b1[i] != b2[i]) {
      return false;
    }
  }

  return true;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

function shuffleArray<T>(original: T[]) {
  // Swap each element with another randomly selected one.
  for (let i = original.length - 1; i > 0; i--) {
    const j = randomInt(i);
    const contents = original[i];
    original[i] = original[j];
    original[j] = contents;
  }
}

function removeElement<T>(array: T[], from: number, to?: number) {
  const rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
}


export function makepuzzle() {
  const b: null[] = Array(81).fill(null)
  return makeboard(solvepuzzle(b));
}
