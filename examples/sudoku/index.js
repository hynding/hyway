import { SudokuHTMLTable } from './SudokuHTMLTable.js';
import { grids } from './grids.js';

init();

function createSelectableValues(sudokuTable) {
  const length = sudokuTable.sudoku.sideLength;
  const container = document.querySelector('#selectable-values');
  container.innerHTML = ''; // Clear existing content
  for (let i = 1; i <= length; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.value = i;
    button.addEventListener('click', (event) => {
      const currentButton = event.target;
      const previousButton = container.querySelector('button.selected');
      const selectedValue = parseInt(currentButton.value, 10);
      if (currentButton !== previousButton) {
        currentButton.classList.add('selected');
        previousButton?.classList.remove('selected');
        sudokuTable.setActiveValue(selectedValue);
      } else {
        currentButton.classList.remove('selected');
        sudokuTable.setActiveValue(0); // Deselect
      }
      sudokuTable.renderSudokuTable();
    });
    container.appendChild(button);
  }
  const clearButton = document.createElement('button');
  clearButton.textContent = 'C';
  clearButton.addEventListener('click', () => {
    sudokuTable.clearSelected();
  });
  container.appendChild(clearButton);
}

function init() {
  const sudokuTable = new SudokuHTMLTable(3, 3, grids[0]);
  createSelectableValues(sudokuTable);
  
  // instant-errors
  document.querySelector('#instant-errors').addEventListener('change', (event) => {
    sudokuTable.toggleInstantErrors();
  });

  document.querySelector('#add-notes').addEventListener('change', (event) => {
    sudokuTable.addNotes = !!event.target.checked;
    console.log('Add notes:', sudokuTable.addNotes);
  });

  document.querySelector('#solve').addEventListener('click', () => {
    sudokuTable.solve();
    console.log('gridNotes:', sudokuTable.sudoku.gridNotes);
  })
}