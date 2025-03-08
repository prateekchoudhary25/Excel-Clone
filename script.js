// Select table and operation button elements
let tableEl = document.getElementById('dataTable');
let operationInputEl = document.getElementById('operationInput');
let operationButtonEl = document.getElementById('operationBtn');
let resetBtnEl = document.getElementById('resetBtn');
let trimBtnEl = document.getElementById('trimBtn');
let upperBtnEl = document.getElementById('upperBtn');
let lowerBtnEl = document.getElementById('lowerBtn');
let removeDuplicatesBtnEl = document.getElementById('removeDuplicatesBtn');
let findInputEl = document.getElementById('findInput');
let replaceInputEl = document.getElementById('replaceInput');
let findReplaceBtnEl = document.getElementById('findReplaceBtn');
let addRowBtnEl = document.getElementById('addRowBtn');
let deleteRowBtnEl = document.getElementById('deleteRowBtn');
let deleteColumnBtnEl = document.getElementById('deleteColumnBtn');
let selectedRow = null;
let selectedColumn = null;
let addColumnBtnEl = document.getElementById('addColumnBtn');

// Function to get selected cells
function getSelectedCells() {
    return Array.from(tableEl.getElementsByClassName('selected'));
}

// Handle cell selection (toggle class 'selected')
function handleCellSelection(event) {
    const cell = event.target;
    if (cell.tagName === 'TD' && !cell.classList.contains('header')) {
        // Deselect previously selected row or column if any
        if (selectedRow) {
            selectedRow.classList.remove('selected');
        }
        if (selectedColumn !== null) {
            Array.from(tableEl.rows).forEach(row => {
                row.cells[selectedColumn].classList.remove('selected');
            });
        }
        // Toggle the 'selected' class for the clicked cell
        cell.classList.toggle('selected');
    }
}

// Handle row selection via the first column (row header)
// Function to handle row selection and deselection
function handleRowSelection(event) {
    const cell = event.target;

    // Only select or deselect the row when clicking the first column (row header)
    if (cell.tagName === 'TD' && cell.cellIndex === 0) {
        const row = cell.closest('tr'); // Get the row the clicked cell belongs to

        if (row) {
            // Check if the clicked row is already selected
            if (row.classList.contains('selected')) {
                // Deselect the row if it's already selected
                row.classList.remove('selected');
                selectedRow = null; // Reset selected row
            } else {
                // If another row is selected, deselect it first
                if (selectedRow) {
                    selectedRow.classList.remove('selected');
                }
                // Select the clicked row
                selectedRow = row;
                selectedRow.classList.add('selected');
            }
        }
    }
}



// Perform operations like SUM, AVERAGE, etc.
function performOperation() {
    const operation = operationInputEl.value.trim().toUpperCase();
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) {
        alert('Please select cells to apply the operation.');
        return;
    }

    let result;
    switch (operation) {
        case 'SUM':
            result = selectedCells.reduce((sum, cell) => {
                const value = parseFloat(cell.textContent || 0);
                return isNaN(value) ? sum : sum + value;
            }, 0);
            break;
        case 'AVERAGE':
            const sum = selectedCells.reduce((sum, cell) => {
                const value = parseFloat(cell.textContent || 0);
                return isNaN(value) ? sum : sum + value;
            }, 0);
            result = sum / selectedCells.length;
            break;
        case 'COUNT':
            result = selectedCells.filter(cell => !isNaN(parseFloat(cell.textContent))).length;
            break;
        case 'MIN':
            result = Math.min(...selectedCells.map(cell => parseFloat(cell.textContent || Infinity)));
            break;
        case 'MAX':
            result = Math.max(...selectedCells.map(cell => parseFloat(cell.textContent || -Infinity)));
            break;
        default:
            alert('Unsupported operation. Please enter SUM, AVERAGE, COUNT, MIN, or MAX.');
            return;
    }
    alert(`Result: ${result}`);
}

// Basic cell manipulation functions like Trim, Uppercase, Lowercase, etc.
function trimCells() {
    const allCells = document.querySelectorAll('td'); // Select all table cells
    
    allCells.forEach(cell => {
        cell.textContent = cell.textContent.replace(/\s+/g, ''); // Remove all spaces from text content
    });
}


function upperCells() {
    const selectedCells = getSelectedCells();
    selectedCells.forEach(cell => {
        cell.textContent = cell.textContent.toUpperCase();
    });
}

function lowerCells() {
    const selectedCells = getSelectedCells();
    selectedCells.forEach(cell => {
        cell.textContent = cell.textContent.toLowerCase();
    });
}

function removeDuplicates() {
    const allCells = document.querySelectorAll('td'); // Select all table cells
    const uniqueValues = new Set();
    
    // Iterate over all cells to find and remove duplicates
    allCells.forEach(cell => {
        const cellValue = cell.textContent.trim();
        
        if (cellValue !== '' && uniqueValues.has(cellValue)) {
            cell.textContent = ''; // Clear duplicate cell
        } else {
            uniqueValues.add(cellValue);
        }
    });
}


function findAndReplace() {
    const findText = findInputEl.value.trim();
    const replaceText = replaceInputEl.value.trim();
    const allCells = document.querySelectorAll('td'); // Select all table cells

    if (findText === '') {
        // If there's no find text, replace empty cells with replaceText
        allCells.forEach(cell => {
            if (cell.textContent.trim() === '') {
                cell.textContent = replaceText;
            }
        });
    } else {
        // If there is findText, perform the find and replace
        allCells.forEach(cell => {
            if (cell.textContent.includes(findText)) {
                // Replace all occurrences of findText with replaceText
                cell.textContent = cell.textContent.replace(new RegExp(findText, 'g'), replaceText);
            }
        });
    }
}


function addRow() {
    const rows = tableEl.rows; // Get all rows in the table
    const cols = rows[0].cells.length; // Get the number of columns from the first row (header row)
    
    // Insert a new row at the end of the table body (tbody)
    const newRow = tableEl.insertRow(rows.length); // This adds the row at the end of the table

    // Loop through each column and add a new cell
    for (let i = 0; i < cols; i++) {
        const cell = newRow.insertCell(i); // Insert a new cell at position i

        // If it's the first cell (column 0), set the text to the row number and "row"
        if (i === 0) {
            const rowNumber = rows.length; // Row number is based on the current number of rows in the table (excluding the header)
            cell.textContent = ` ${rowNumber - 1}`; // Add row number and "row" text
        } else {
            cell.contentEditable = true; // Make other cells editable
        }
    }
}



// Function to handle column selection
function handleColumnSelection(event) {
    const headerCell = event.target;
    const columnIndex = headerCell.cellIndex; // Get the column index of the clicked header

    // Check if the clicked header is already selected
    if (headerCell.classList.contains('selected')) {
        // Deselect the column if it's already selected
        Array.from(tableEl.rows).forEach(row => {
            row.cells[columnIndex].classList.remove('selected');
        });
        headerCell.classList.remove('selected');
        selectedColumn = null; // Reset selected column
    } else {
        // Deselect the previously selected column if any
        if (selectedColumn !== null) {
            Array.from(tableEl.rows).forEach(row => {
                row.cells[selectedColumn].classList.remove('selected');
            });
        }

        // Select the new column
        selectedColumn = columnIndex;
        Array.from(tableEl.rows).forEach(row => {
            row.cells[selectedColumn].classList.add('selected');
        });

        // Mark the header as selected
        headerCell.classList.add('selected');
    }
}


function addColumn() {
    const rows = tableEl.rows;
    const cols = rows[0].cells.length; // Get the current number of columns

    // Function to convert column index to letter (A, B, C, ... AA, AB, etc.)
    function getColumnLetter(index) {
        let letter = "";
        while (index >= 0) {
            letter = String.fromCharCode((index % 26) + 65) + letter;
            index = Math.floor(index / 26) - 1;
        }
        return letter;
    }

    const columnLetter = getColumnLetter(cols); // Get column letter for the new column

    // Add a new header cell in the first row (header row)
    const headerCell = document.createElement('th');
    headerCell.contentEditable = true; // Make the header cell editable
    headerCell.textContent = columnLetter; // Use column letter instead of "Header X"
    headerCell.classList.add('header'); // Add class for column header
    rows[0].appendChild(headerCell); // Append the new header cell to the first row

    // Add event listener to make the new header selectable
    headerCell.addEventListener('click', handleColumnSelection);

    // Loop through each row and add a new cell at the end
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].insertCell(cols); // Insert new cell at the end of the row
        cell.contentEditable = true; // Make the new cell editable
    }
}


function deleteRow() {
    if (selectedRow) {
        selectedRow.remove();
        selectedRow = null;
    } else {
        alert("Please select a row to delete.");
    }
}

// Delete selected column
function deleteColumn() {
    if (selectedColumn !== null) {
        Array.from(tableEl.rows).forEach(row => {
            row.deleteCell(selectedColumn);
        });
        selectedColumn = null;
    } else {
        alert("Please select a column to delete.");
    }
}


// Event Listeners
operationButtonEl.addEventListener('click', performOperation);
resetBtnEl.addEventListener('click', () => {
    const selectedCells = getSelectedCells();
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    operationInputEl.value = '';
});

tableEl.addEventListener('click', handleCellSelection);
// Add row selection handler
tableEl.addEventListener('click', handleRowSelection);

Array.from(tableEl.getElementsByClassName('header')).forEach(header => {
    header.addEventListener('click', handleColumnSelection);
});

addRowBtnEl.addEventListener('click', addRow);
deleteRowBtnEl.addEventListener('click', deleteRow);
deleteColumnBtnEl.addEventListener('click', deleteColumn);
addColumnBtnEl.addEventListener('click', addColumn);

trimBtnEl.addEventListener('click', trimCells);
upperBtnEl.addEventListener('click', upperCells);
lowerBtnEl.addEventListener('click', lowerCells);
removeDuplicatesBtnEl.addEventListener('click', removeDuplicates);
findReplaceBtnEl.addEventListener('click', findAndReplace);


// Add event listener for the Bold button
document.getElementById('boldBtn').addEventListener('click', function() {
    // Get the selected cells
    const selectedCells = getSelectedCells();

    // If there are any selected cells, toggle the bold style
    selectedCells.forEach(cell => {
        if (cell.style.fontWeight === 'bold') {
            cell.style.fontWeight = 'normal'; // Remove bold if already applied
        } else {
            cell.style.fontWeight = 'bold'; // Apply bold
        }
    });
});


// Add event listener for the Italic button
document.getElementById('italicBtn').addEventListener('click', function() {
    // Get the selected cells
    const selectedCells = getSelectedCells();

    // If there are any selected cells, toggle the italic style
    selectedCells.forEach(cell => {
        if (cell.style.fontStyle === 'italic') {
            cell.style.fontStyle = 'normal'; // Remove italic if already applied
        } else {
            cell.style.fontStyle = 'italic'; // Apply italic
        }
    });
});



document.getElementById('fontSizeSlider').addEventListener('input', function() {
    const fontSize = this.value + 'px';
    document.getElementById('fontSizeValue').textContent = fontSize; // Update font size display
    const selectedCells = getSelectedCells();

    // Apply the selected font size to the selected cells
    selectedCells.forEach(cell => {
        cell.style.fontSize = fontSize;
    });
});



// Font color picker functionality
document.getElementById('fontColorPicker').addEventListener('input', function() {
    const color = this.value; // Get the selected color
    const selectedCells = getSelectedCells();

    // Apply the selected color to the selected cells
    selectedCells.forEach(cell => {
        cell.style.color = color;
    });
});

