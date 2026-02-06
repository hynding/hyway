import { getGroupConsolidatedCollectionArray } from 'hyway/core'

export class SudokuSolver {
  constructor(sudoku) {
    this.sudoku = sudoku;
    this.solutions = [];
  }

  solve() {
    this._fillNotes(0);
    this._solveNotes();
  }

  _fillNotes(index) {
    if (index >= this.sudoku.grid.length) {
      this.solutions.push([...this.sudoku.grid]);
      return;
    }

    const row = Math.floor(index / this.sudoku.sideLength);
    const col = index % this.sudoku.sideLength;

    if (this.sudoku.isStaticCell(row, col) || this.sudoku.getCell(row, col)) {
      this._fillNotes(index + 1);
      return;
    }

    for (let value = 1; value <= this.sudoku.sideLength; value++) {
      if (this._isValid(row, col, value)) {
        this.sudoku.updateNotes(row, col, value);
        // this._solve(index + 1);
        // this.sudoku.updateCell(row, col, 0); // Reset cell
      }
    }

    const notesIndex = this.sudoku.getIndex(row, col);
    
    if (this.sudoku.gridNotes[notesIndex].length === 1) {
      const notes = this.sudoku.gridNotes[notesIndex];
      this.sudoku.updateCell(row, col, notes[0]);
      // this.sudoku.gridNotes = this.sudoku.grid.slice(); // Reset notes
      this._fillNotes(0);
      return;
    }
    this._fillNotes(index + 1);
  }

  _solveNotes() {
    // console.log('...', getGroupConsolidatedCollectionArray(this.sudoku.getRow(0, true)));
    for (let section = 0; section < this.sudoku.sideLength; section++) {
      const rowNotes = getGroupConsolidatedCollectionArray(this.sudoku.getRow(section, true));
      rowNotes.forEach((notes, col) => {
        if (notes.length === 1) {
          this.sudoku.updateCell(section, col, notes[0]);
        } else {
          this.sudoku.gridNotes[section * this.sudoku.sideLength + col] = notes;
        }
      })
    }
    for (let section = 0; section < this.sudoku.sideLength; section++) {
      const colNotes = getGroupConsolidatedCollectionArray(this.sudoku.getCol(section, true));
      colNotes.forEach((notes, row) => {
        if (notes.length === 1) {
          this.sudoku.updateCell(row, section, notes[0]);
        } else {
          this.sudoku.gridNotes[row * this.sudoku.sideLength + section] = notes;
        }
      })
    }
    // console.log('Final Notes:', getGroupConsolidatedCollectionArray(this.sudoku.getCol(0, true)));
  }

  _isValid(row, col, value) {
    return !this._isInRow(row, value) &&
           !this._isInCol(col, value) &&
           !this._isInBox(row, col, value);
  }

  _isValidNoteSet(row, col, value) {
    return !this._includesRowNotesSet(row, value) &&
           !this._includesColNotesSet(col, value) &&
           !this._includesBoxNotesSet(row, col, value);
  }

  _isInRow(row, value) {
    for (let col = 0; col < this.sudoku.sideLength; col++) {
      if (this.sudoku.getCell(row, col) === value) {
        return true;
      }
    }
    return false;
  }

  _isInCol(col, value) {
    for (let row = 0; row < this.sudoku.sideLength; row++) {
      if (this.sudoku.getCell(row, col) === value) {
        return true;
      }
    }
    return false;
  }

  _isInBox(row, col, value) {
    const boxRow = Math.floor(row / this.sudoku.boxHeight);
    const boxCol = Math.floor(col / this.sudoku.boxWidth);

    for (let r = 0; r < this.sudoku.boxHeight; r++) {
      for (let c = 0; c < this.sudoku.boxWidth; c++) {
        const cellValue = this.sudoku.getCell(boxRow * this.sudoku.boxHeight + r,
                                               boxCol * this.sudoku.boxWidth + c);
        if (cellValue === value) {
          return true;
        }
      }
    }
    return false;
  }

  _includesRowNotesSet(row, value) {
    // FIX: currently only accounts for true match set
    const note = value.join(',');
    for (let col = 0; col < this.sudoku.sideLength; col++) {
      if (this.sudoku.getCellNotes(row, col).join(',') === note) {
        return true;
      }
    }
    return false;
  }

  _includesColNotesSet(col, value) {
    // FIX: currently only accounts for true match set
    const note = value.join(',');
    for (let row = 0; row < this.sudoku.sideLength; row++) {
      if (this.sudoku.getCellNotes(row, col).join(',') === note) {
        return true;
      }
    }
    return false;
  }

  _includesBoxNotesSet(row, col, value) {
    // FIX: currently only accounts for true match set
    const note = value.join(',');

    const boxRow = Math.floor(row / this.sudoku.boxHeight);
    const boxCol = Math.floor(col / this.sudoku.boxWidth);

    for (let r = 0; r < this.sudoku.boxHeight; r++) {
      for (let c = 0; c < this.sudoku.boxWidth; c++) {
        const cellNote = this.sudoku.getCell(boxRow * this.sudoku.boxHeight + r,
                                               boxCol * this.sudoku.boxWidth + c).join(',');
        if (cellNote === note) {
          return true;
        }
      }
    }
    return false;
  }
}

/**
 * Given a row with [[1,2,3], [2,3,4], [1,2,3], [1,2,3]]
 * [[1,2],[1,2,3,4,5],[2,3],[1,2,3],[4,5]] -> [[1,2],[2,3],[1,2,3]] ~ [[1,2],[4,5],[2,3],[1,2,3],[4,5]]
 */