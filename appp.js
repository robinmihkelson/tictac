// Get references to the DOM elements (HTML elements)
const gameBoardDiv = document.getElementById('game-board'); // Game board container
const messageDiv = document.getElementById('message'); // Message display (win, draw)
const resetBtn = document.getElementById('reset-game'); // Reset button

// Define the size of the game board (3x3 for standard Tic-Tac-Toe)
const gameBoardSize = 3;

// Define the symbols used by players
const symbols = ['X', 'O']; // Player 1 is 'X' and Player 2 is 'O'

// Initialize necessary game variables
let nextPlayer, playerWon, moveCount, gameState, winningCombinations; 

// Initialize the winning combinations (rows, columns, diagonals)
initWinningCombinations();

// Start a new game
initGame();

// Event listener for the reset button
resetBtn.addEventListener('click', e => {
    initGame(); // Start a new game when the reset button is clicked
});

// Function to initialize all the winning combinations (rows, columns, diagonals)
function initWinningCombinations () {
    winningCombinations = [];
    
    // Create row winning combinations
    for ( let i = 0; i < gameBoardSize; i++ ) {
        
        let row = [];
        let col = [];
        
        // Each row is a winning combination
        // Each column is a winning combination
        for ( let j = 0; j < gameBoardSize; j++ ) {
            row.push(`${i}${j}`); // Row coordinates
            col.push(`${j}${i}`); // Column coordinates
        }
        
        winningCombinations.push(row); // Add row combination to winning combinations
        winningCombinations.push(col); // Add column combination to winning combinations
    }
    
    // Create diagonal winning combinations
    let d1 = []; // Diagonal 1 (top-left to bottom-right)
    let d2 = []; // Diagonal 2 (top-right to bottom-left)
    
    for ( let k = 0; k < gameBoardSize; k++ ) {
        d1.push(`${k}${k}`); // Top-left to bottom-right diagonal
        d2.push(`${k}${gameBoardSize - 1 - k}`); // Top-right to bottom-left diagonal
    }

    // Add both diagonals to the winning combinations array
    winningCombinations.push(d1);
    winningCombinations.push(d2);

    console.log(winningCombinations); // Log the winning combinations to the console
}

// Function to initialize the game
function initGame () {
    nextPlayer = 0; // Player 1 (X) starts the game
    playerWon = false; // No player has won yet
    moveCount = 0; // Track the number of moves made so far
    gameState = [[], []]; // Array to store moves for both players (0 for X, 1 for O)

    initGameBoard(); // Initialize the game board
}

// Function to create and initialize the game board (3x3 grid)
function initGameBoard () {
    gameBoardDiv.innerHTML = ''; // Clear the game board
    messageDiv.innerText = ''; // Clear the message display

    // Set the grid layout of the game board using CSS Grid
    gameBoardDiv.style.gridTemplateColumns = `repeat(${gameBoardSize}, 64px)`; 
    gameBoardDiv.style.gridTemplateRows = `repeat(${gameBoardSize}, 64px)`; 

    // Loop through each cell of the game board to create the grid
    for ( let y = 0; y < gameBoardSize; y++ ) {
        for ( let x = 0; x < gameBoardSize; x++ ) {
            // Create each cell as a div element
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell'); // Add class for styling
            cellDiv.dataset.y = y; // Store y-coordinate in the data attribute
            cellDiv.dataset.x = x; // Store x-coordinate in the data attribute

            // Add click event listener for the cell
            cellDiv.addEventListener('click', e => {
                // Allow the move if the cell is empty and no player has won yet
                if ( !e.target.innerText && !playerWon ) {
                    moveCount++; // Increment the move count
                    const move = e.target.dataset.y + e.target.dataset.x; // Get the move's coordinates
                    gameState[nextPlayer].push(move); // Store the move for the current player

                    // Update the cell with the player's symbol (X or O)
                    e.target.innerText = symbols[nextPlayer];

                    // Check if the player has won after making this move
                    if ( hasPlayerWon(gameState[nextPlayer]) ) {
                        playerWon = true; // Mark that a player has won
                        messageDiv.innerText = `${symbols[nextPlayer]} VÕITIS MÄNGU!`; // Display the win message
                    } else if ( moveCount == gameBoardSize ** 2 ) {
                        // If all cells are filled and no one won, it's a draw
                        messageDiv.innerText = `MÄNG JÄI VIIKI!`;
                    }

                    // Switch to the other player
                    nextPlayer = Number(!nextPlayer);
                }
            });

            // Add the cell to the game board
            gameBoardDiv.appendChild(cellDiv);
        }
    }
}

// Function to check if the current player has won
function hasPlayerWon ( moves ) {
    let hasPlayerWon = false;

    // Check each winning combination to see if the player has matched it
    winningCombinations.forEach( c => {
        if ( c.every(m => moves.includes(m)) ) { // If all moves in the combination are included
            hasPlayerWon = true; // Player has won
            // Highlight the winning cells by adding the 'winning' class
            c.forEach( ([y, x]) => {
                document.querySelector(`.cell[data-y="${y}"][data-x="${x}"]`).classList.add('winning');
            });
        }
    });
    
    return hasPlayerWon; // Return whether the player has won
}
