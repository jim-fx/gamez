export function findSudokuErrors(initialGrid: number[], userGrid: number[]): number[] {
  const errors: number[] = [];

  // Check each row, column, and 3x3 square for errors
  for (let i = 0; i < 9; i++) {
    const row = new Set<number>();
    const col = new Set<number>();
    const square = new Set<number>();

    for (let j = 0; j < 9; j++) {
      // Check row
      const rowIndex = i * 9 + j;
      if (initialGrid[rowIndex] !== 0) {
        row.add(initialGrid[rowIndex]);
      }
      const rowValue = userGrid[rowIndex] || 0;
      if (rowValue !== 0) {
        if (row.has(rowValue)) {
          errors.push(rowIndex);
          break;
        } else {
          row.add(rowValue);
        }
      }


      // Check column
      const colIndex = i + j * 9;
      if (initialGrid[colIndex] !== 0) {
        col.add(initialGrid[colIndex]);
      }
      const colValue = userGrid[colIndex] || 0;
      if (colValue !== 0) {
        if (col.has(colValue) || initialGrid[colIndex] !== 0 && initialGrid[colIndex] !== colValue) {
          errors.push(colIndex);
          break;
        } else {
          col.add(colValue);
        }
      }

      // Check 3x3 square
      const squareIndex = 27 * Math.floor(i / 3) + 3 * (i % 3) + 9 * Math.floor(j / 3) + (j % 3);
      if (initialGrid[squareIndex] !== 0) {
        square.add(initialGrid[squareIndex]);
      }
      const squareValue = userGrid[squareIndex] || 0;
      if (squareValue !== 0) {
        if (square.has(squareValue) || initialGrid[squareIndex] !== 0 && initialGrid[squareIndex] !== squareValue) {
          errors.push(squareIndex);
          break;
        } else {
          square.add(squareValue);
        }
      }
    }
  }

  return errors;
}

export function checkIfWon(initialGrid: number[], userGrid: number[]) {
  for (let i = 0; i < 81; i++) {
    if (!initialGrid[i] && !userGrid[i]) return false;
  }
  return true;
}

export function calculateTip(initialGrid: number[], userGrid: number[]) {

  const values = new Array(81).fill(null).map((_, i) => initialGrid[i] || userGrid[i] || 0);

  const cells = new Array(81).fill(null).map(() => new Set(Array(9).fill(null).map((_, i) => i)));

  for (let i = 0; i < 9; i++) {

    // Search rows
    for (let j = 0; j < 9; j++) {
    }

    // Search columns
    for (let j = 0; j < 9; j++) {
    }

    // search 3x3 squares
    for (let j = 0; j < 9; j++) {
    }

  }

}
