import { Sudoku } from './Sudoku.js';
import { SudokuSolver } from './SudokuSolver.js';
import { SSA } from './SudokuSolverAdvanced.js';

export class SudokuHTMLTable {
  constructor(boxWidth = 3, boxHeight = 3, initialGrid = null) {
    this.sudoku = new Sudoku(boxWidth, boxHeight, initialGrid);
    this.table = document.querySelector('table.sudoku');
    this.renderSudokuTable();
    this.table.addEventListener('click', this.handleCellClick.bind(this));
    this.activeValue = 0;
    this.setSelected();
    this.showInstantErrors = true;
    this.addNotes = false;
  }

  toggleInstantErrors() {
    this.showInstantErrors = !this.showInstantErrors;
  }

  setSelected(row = -1, col = -1) {
    this.selectedRow = row;
    this.selectedCol = col;
  }

  resetSelected() {
    this.setSelected();
  }

  hasSelected() {
    return this.selectedRow >= 0 && this.selectedCol >= 0;
  }

  clearSelected() {
    this.sudoku.updateCell(this.selectedRow, this.selectedCol, 0);
    this.renderSudokuTable();
  }

  setActiveValue(value) {
    if (value >= 0 && value <= this.sudoku.sideLength) {
      this.activeValue = value;
    }
    if (this.hasSelected() && this.activeValue) {
      if (this.addNotes) {
        this.sudoku.updateNotes(this.selectedRow, this.selectedCol, this.activeValue);
      } else {
        this.sudoku.updateCell(this.selectedRow, this.selectedCol, this.activeValue);
      }
    }
    this.renderSudokuTable();
  }

  handleCellClick(event) {
    const cellDiv = event.target.closest('td');
    if (cellDiv) {
      const row = parseInt(cellDiv.dataset.row, 10);
      const col = parseInt(cellDiv.dataset.col, 10);
      if (this.sudoku.isStaticCell(row, col)) {
        // If the cell is static, do not allow selection or modification
        return;
      }
      if (cellDiv.classList.contains('selected')) {
        this.setSelected();
      } else {
        this.setSelected(row, col);
        if (this.activeValue) {
          if (this.addNotes) {
            this.sudoku.updateNotes(row, col, this.activeValue);
          } else {
            this.sudoku.updateCell(this.selectedRow, this.selectedCol, this.activeValue);
          }
        }
      }
      this.renderSudokuTable();
    }
  }

  renderSudokuTable() {
    this.table.innerHTML = ''; // Clear existing table content
    for (let row = 0; row < this.sudoku.sideLength; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < this.sudoku.sideLength; col++) {
        const td = document.createElement('td');
        this.addCellClassName(td, row, col);
        const value = this.sudoku.getCell(row, col) || '';
        if (value) {
          td.textContent = value;
        } else if (this.sudoku.gridNotes[this.sudoku.getIndex(row, col)]?.length) {
          // If there are notes, display them
          const notes = this.sudoku.gridNotes[this.sudoku.getIndex(row, col)];
          td.style.fontSize = '8px'; // Smaller font for notes
          td.style.lineHeight = '8px';
          td.textContent = notes.join(', ');
          td.classList.add('notes');
        }
        td.dataset.row = row;
        td.dataset.col = col;
        tr.appendChild(td);
      }
      this.table.appendChild(tr);
    }
  }

  isTopEdgeCell(row, col) {
    return row % this.sudoku.boxHeight === 0;
  }
  isLeftEdgeCell(row, col) {
    return col % this.sudoku.boxWidth === 0;
  }
  isBottomEdgeCell(row, col) {
    return (row + 1) % this.sudoku.boxHeight === 0;
  }
  isRightEdgeCell(row, col) {
    return (col + 1) % this.sudoku.boxWidth === 0;
  }
  addCellClassName(td, row, col) {
    let className = '';
    if (this.isTopEdgeCell(row, col)) td.classList.add('top-edge');
    if (this.isLeftEdgeCell(row, col)) td.classList.add('left-edge');
    if (this.isBottomEdgeCell(row, col)) td.classList.add('bottom-edge');
    if (this.isRightEdgeCell(row, col)) td.classList.add('right-edge');
    if (row === this.selectedRow && col === this.selectedCol) {
      td.classList.add('selected');
    }
    if (this.sudoku.isStaticCell(row, col)) {
      td.classList.add('static');
    }
    return className.trim();
  }

  solve() {
    // const solver = new SudokuSolver(this.sudoku);
    // console.log('calling solve')
    // solver.solve();
    // this.renderSudokuTable();

    let matrix = []
    for (let row = 0; row < this.sudoku.sideLength; row++) {
      const rowData = [];
      for (let col = 0; col < this.sudoku.sideLength; col++) {
        rowData.push(this.sudoku.staticGrid[row * this.sudoku.sideLength + col] || 0);
      }
      matrix.push(rowData);
    }
    console.log('allowedBitFields', SSA.allowedBitFields);
    console.log('staticGrid', this.sudoku.staticGrid);
    console.log('matrix', matrix);
    SSA.solve(matrix)
    // SSA.solve([
    //   [0,7,8,0,0,0,9,5,0],
    //   [0,0,5,2,0,9,0,0,0],
    //   [0,0,0,5,0,0,0,4,0],
    //   [1,0,0,0,0,0,0,0,6],
    //   [9,0,0,3,0,1,0,0,0],
    //   [8,0,0,0,0,0,0,0,7],
    //   [0,0,0,0,1,5,0,0,0],
    //   [0,0,0,4,0,8,5,0,0],
    //   [0,1,3,0,0,0,6,8,0]
    // ])
  }
}