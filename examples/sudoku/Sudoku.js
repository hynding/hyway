export class Sudoku {
  constructor(boxWidth = 3, boxHeight = 3, initialGrid = null) {
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;
    this.sideLength = boxWidth * boxHeight;
    this.area = this.sideLength * this.sideLength;
    this.grid = (Array.isArray(initialGrid) && initialGrid.length === this.area)
      ? [...initialGrid]
      : new Array(this.sideLength * this.sideLength).fill(0);
    this.staticGrid = this.grid.slice();
    this.gridNotes = this.grid.slice();
    // this.solve();
  }

  getIndex(row, col) {
    if (row < 0 || row >= this.sideLength || col < 0 || col >= this.sideLength) {
      throw new Error('Row or column index out of bounds');
    }
    return row * this.sideLength + col;
  }

  updateCell(row, col, value) {
    if (value < 0 || value > this.sideLength) {
      throw new Error('Value must be between 0 and ' + this.sideLength);
    }
    const index = this.getIndex(row, col);
    this.grid[index] = value;
  }

  isStaticCell(row, col) {
    const index = this.getIndex(row, col);
    return !!this.staticGrid[index];
  }

  getBoxArray(row, col, asNotes = false) {
    const boxRow = Math.floor(row / this.boxHeight);
    const boxCol = Math.floor(col / this.boxWidth);
    const boxArray = [];

    for (let r = 0; r < this.boxHeight; r++) {
      for (let c = 0; c < this.boxWidth; c++) {
        const index = (boxRow * this.boxHeight + r) * this.sideLength + (boxCol * this.boxWidth + c)
        if (asNotes) {
          boxArray.push(Array.isArray(this.gridNotes[index]) ? this.gridNotes[index] : [[this.gridNotes[index]]]);
        } else {
          boxArray.push(this.grid[index]);
        }
      }
    }
    return boxArray;
  }

  getBoxRow(row) {
    return Math.floor(row / this.boxHeight);
  }

  getRow(row, asNotes = false) {
    const index = row % this.sideLength;
    if (asNotes) {
      return this.gridNotes
        .slice(index * this.sideLength, (index + 1) * this.sideLength)
        .map((notes, i) => Array.isArray(notes) ? notes : [this.grid[index * this.sideLength + i]]);
    }
    return this.grid.slice(index * this.sideLength, (index + 1) * this.sideLength);;
  }

  getCol(col, asNotes = false) {
    const colArray = [];
    for (let row = 0; row < this.sideLength; row++) {
      const index = this.getIndex(row, col);
      if (asNotes) {
        colArray.push(Array.isArray(this.gridNotes[index]) ? this.gridNotes[index] : [[this.grid[index]]]);
      } else {
        colArray.push(this.grid[index]);
      }
    }
    return colArray;
  }

  getBoxCol(col) {
    return Math.floor(col / this.boxWidth);
  }

  getCell(row, col) {
    const index = this.getIndex(row, col);
    return this.grid[index];
  }

  getCellNotes(row, col) {
    const index = this.getIndex(row, col);
    return this.gridNotes[index] || [];
  }

  updateNotes(row, col, value) {
    if (value < 0 || value > this.sideLength) {
      throw new Error('Value must be between 0 and ' + this.sideLength);
    }
    const index = this.getIndex(row, col);
    if (!this.gridNotes[index]) {
      this.gridNotes[index] = [];
    }
    if (!this.gridNotes[index].includes(value)) {
      this.gridNotes[index].push(value);
      this.gridNotes[index].sort();
    }
  }

  validateRow(row) {
    const seen = new Set();
    for (let col = 0; col < this.sideLength; col++) {
      const value = this.getCell(row, col);
      if (value > 0) {
        if (seen.has(value)) {
          return false; // Duplicate found
        }
        seen.add(value);
      }
    }
    return true;
  }
  validateColumn(col) {
    const seen = new Set();
    for (let row = 0; row < this.sideLength; row++) {
      const value = this.getCell(row, col);
      if (value > 0) {
        if (seen.has(value)) {
          return false; // Duplicate found
        }
        seen.add(value);
      }
    }
    return true;
  }
  validateBox(row, col) {
    const boxArray = this.getBoxArray(row, col);
    const seen = new Set();
    for (const value of boxArray) {
      if (value > 0) {
        if (seen.has(value)) {
          return false; // Duplicate found
        }
        seen.add(value);
      }
    }
    return true;
  }
  validate() {
    for (let i = 0; i < this.sideLength; i++) {
      if (!this.validateRow(i) || !this.validateColumn(i)) {
        return false; // Invalid row or column
      }
    }
    for (let row = 0; row < this.sideLength; row += this.boxHeight) {
      for (let col = 0; col < this.sideLength; col += this.boxWidth) {
        if (!this.validateBox(row, col)) {
          return false; // Invalid box
        }
      }
    }
    return true; // Sudoku is valid
  }

  getEmptyCells() {
    const emptyCells = [];
    for (let row = 0; row < this.sideLength; row++) {
      for (let col = 0; col < this.sideLength; col++) {
        if (this.getCell(row, col) === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }

  getRowCol(index) {
    if (index < 0 || index >= this.area) {
      throw new Error('Index out of bounds');
    }
    const row = Math.floor(index / this.sideLength);
    const col = index % this.sideLength;
    return { row, col };
  }

  solve() {
    if (this.solution) {
      return
    }
    const solver = new Sudoku(this.boxWidth, this.boxHeight, this.staticGrid);

    function solveRecursive() {
      const emptyCells = solver.getEmptyCells();
      if (emptyCells.length === 0) {
        solver.solution = [...solver.grid];
        return true; // Solved
      }

      // solve or set grid notes for each empty cell
      emptyCells.forEach(({ row, col }) => {
        const cellValue = solver.getCell(row, col);
        if (cellValue === 0) {
          // If the cell is empty, we can try to fill it
          const possibleValues = new Set();
          for (let value = 1; value <= solver.sideLength; value++) {
            solver.updateCell(row, col, value);
            if (solver.validate()) {
              possibleValues.add(value);
            }
            solver.updateCell(row, col, 0); // Reset cell
          }
          solver.gridNotes[solver.getIndex(row, col)] = Array.from(possibleValues);
        } else {
          // If the cell is already filled, we can note it as a static cell
          solver.gridNotes[solver.getIndex(row, col)] = [cellValue];
        }
      })

      // const { row, col } = emptyCells[0];
      // for (let value = 1; value <= solver.sideLength; value++) {
      //   solver.updateCell(row, col, value);
      //   if (solver.validate()) {
      //     if (solveRecursive(solver)) {
      //       return true; // Found a solution
      //     }
      //   }
      //   solver.updateCell(row, col, 0); // Reset cell
      // }
      // return false; // No solution found
    }
    if (!solveRecursive(solver)) {
      throw new Error('No solution found for the Sudoku puzzle');
    }
    this.solution = solver.solution;
  }
}