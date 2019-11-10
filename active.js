(function Game() {

    let game = document.getElementById('columns');
    let playField = document.querySelectorAll('li');
    let resetGame = document.getElementById('resetGame');
    let turnDisplay = document.getElementById('whoseTurn');
    let gameMessages = document.getElementById('informationAboutWins');
    let playerOneScoreCard = document.getElementById('playerOne');
    let playerTwoScoreCard = document.getElementById('playerTwo');
    let playerOneScore = 0;
    let playerTwoScore = 0;
    let playersSymbol = { 'player1' : 'x', 'player2' : 'o' };
    let board = [];
    let turns;
    let currentContext;

    let init = function() {
        turns = 0;

        // Get current playersSymbol
        currentContext = computeContext();

        // Setup 3 x 3 board
        board[0] = new Array(3);
        board[1] = new Array(3);
        board[2] = new Array(3);

        // bind events
        for(let i = 0; i < playField.length; i++) {
            playField[i].addEventListener('click', clickHandler, false);
        }

        resetGame.addEventListener('click', resetGameHandler, false);
    };

    //Keeps track of player's turn
    let computeContext = function() {
        return (turns % 2 == 0) ? playersSymbol.player1 : playersSymbol.player2;
    };

    // Bind the dom element to the click callback
    let clickHandler = function() {
        this.removeEventListener('click', clickHandler);

        this.className = currentContext;
        this.innerHTML = currentContext;

        let pos = this.getAttribute('data-pos').split(',');
        board[pos[0]][pos[1]] = computeContext() == 'x' ? 1 : 0;

        if(checkStatus()) {
            gameWon();
        }

        turns++;
        currentContext = computeContext();
        turnDisplay.className = currentContext;
    };


    // Check to see if player has won
    let checkStatus = function() {
        let used_boxes = 0;

        for(let rows = 0; rows < board.length; rows++ ) {
            let rowTotal = 0;
            let columnTotal = 0;

            for(let columns = 0; columns < board[rows].length; columns++) {
                rowTotal += board[rows][columns];
                columnTotal += board[columns][rows];

                if(typeof board[rows][columns] !== "undefined") {
                    used_boxes++;
                }
            }

            // Winning combination for diagonal scenario [0,4,8], [2,4,6]
            let diagonal_tl_br = board[0][0] + board[1][1] + board[2][2]; // diagonal top left to bottom right
            let diagonal_tr_bl = board[0][2] + board[1][1] + board[2][0]; // diagonal top right bottom left

            if(diagonal_tl_br == 0 || diagonal_tr_bl == 0 || diagonal_tl_br == 3 || diagonal_tr_bl == 3) {
                return true;
            }

            // Winning combination for row [0,1,2], [3,4,5], [6,7,8]
            // Winning combination for column [0,3,6], [1,4,7], [2,5,8]
            // Only way to win is if the total is 0 or if the total is 3. X are worth 1 point and O are worth 0 points
            if(rowTotal == 0 || columnTotal == 0 || rowTotal == 3 || columnTotal == 3) {
                return true;
            }

            // if all boxes are full - Draw!!!
            if(used_boxes == 9) {
                gameDraw();
            }
        }
    };
    let gameWon = function() {
        clearEvents();

        // show game won message
        gameMessages.className = 'player-' + computeContext() + '-win';

        // update the player score
        switch(computeContext()) {
            case 'x':
                playerOneScoreCard.innerHTML = ++playerOneScore;
                break;
            case 'o':
                playerTwoScoreCard.innerHTML = ++playerTwoScore;
        }
    };
    // Tells user when game is a draw.
    let gameDraw = function() {
        gameMessages.className = 'draw';
        clearEvents();
    }

    // Stops user from clicking empty cells after game is over
    let clearEvents = function() {
        for(let i = 0; i < playField.length; i++) {
            playField[i].removeEventListener('click', clickHandler);
        }
    };
    // Reset game to play again
    let resetGameHandler = function() {
        clearEvents();
        init();

        // Go over all the li nodes and remove className of either x,o
        // clear out innerHTML
        for(let i = 0; i < playField.length; i++) {
            playField[i].className = '';
            playField[i].innerHTML = '';
        }

        // Change Who's turn class back to player1
        turnDisplay.className = currentContext;
        gameMessages.className = '';
    };

    game && init();
})();
