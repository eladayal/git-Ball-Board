var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '🕸'

var gAddGlue;
var gAddBall;
var gBoard;
var gGamerPos;
var gBallCount;
var gBallSound;
var gGamerIsStuck;


// Passages
var gPsgUp
var gPsgLeft
var gPsgRight
var gPsgDown

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBallCount = 0;
	gBoard = buildBoard();
	renderBoard(gBoard);
	gAddBall = setInterval(addBall, 5000);
	console.table(gBoard);
	gAddGlue = setInterval(addGlue, 5000);


}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
				board[0][Math.abs(board.length / 2)].type = FLOOR
				board[Math.abs(board.length / 2)][0].type = FLOOR
				board[Math.abs(board.length / 2)][Math.abs(board[0].length - 1)].type = FLOOR
				board[Math.abs(board.length - 1)][Math.abs(board.length / 2)].type = FLOOR
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.table(board);
	return board;
}


// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// DONE - change to short if statement
			// if (currCell.type === FLOOR) cellClass += ' floor';
			// else if (currCell.type === WALL) cellClass += ' wall';
			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';

			//DONE - Change To template string
			strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`;

			// DONE - change to switch case statement
			// if (currCell.gameElement === GAMER) {
			// 	strHTML += GAMER_IMG;
			// } else if (currCell.gameElement === BALL) {
			// 	strHTML += BALL_IMG;
			// }
			switch (currCell.gameElement) {
				case GAMER:
					strHTML += GAMER_IMG;
					break;
				case BALL:
					strHTML += BALL_IMG;
					break;
				case GLUE:
					strHTML += GLUE_IMG;
					break;

			}

			strHTML += `\t</td>\n`;
		}
		strHTML += `</tr>\n`;
	}

	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	if (gGamerIsStuck) return

	if (i === -1) i = gBoard.length - 1;
	if (i === gBoard.length) i = 0;
	if (j === -1) j = gBoard[0].length - 1
	if (j === gBoard[0].length) j = 0;

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// if(())
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) ||
		iAbsDiff === gBoard.length - 1 ||
		jAbsDiff === gBoard[0].length - 1) {

		ballCheck()
		if (targetCell.gameElement === BALL) {
			ballCount()
			console.log('Collecting!');
		}
		if (targetCell.gameElement === GLUE){
			gGamerIsStuck = true
			setTimeout(() => {
				gGamerIsStuck = false

			}, 3000);

		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);


	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function addGlue() {
	var emptyCells = getAllEmptyCells()

	var randomIdx = getRandomInt(0, emptyCells.length - 1)

	var emptyCell = emptyCells[randomIdx];

	gBoard[emptyCell.i][emptyCell.j].gameElement = GLUE

	renderCell(emptyCell, GLUE_IMG)
	setTimeout(function () {
		if (gBoard[emptyCell.i][emptyCell.j].gameElement === GAMER) return
		gBoard[emptyCell.i][emptyCell.j].gameElement = null
		renderCell(emptyCell, '')
	}, 3000)

}


function addBall() { // ADD BALL יודע אך ורק להוסיף כדור ותו לא
	//1 - Get all (type.floor && gameElement: null) empty  cells has an array
	var emptyCells = getAllEmptyCells()

	//2 - get a random index
	var randomIdx = getRandomInt(0, emptyCells.length - 1)

	//3 - get location from array
	var emptyCell = emptyCells[randomIdx];

	//4 - place a ball at location on gBoard (update model)
	gBoard[emptyCell.i][emptyCell.j].gameElement = BALL

	//5 - update ball at DOM
	renderCell(emptyCell, BALL_IMG)

}

function getAllEmptyCells() {
	var emptyCells = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j];
			// console.log('currCell:', currCell);

			if (currCell.type === FLOOR && currCell.gameElement === null) emptyCells.push({ i: i, j: j })
		}
	}
	return emptyCells
}


function ballCount() {
	var elBallCounter = document.querySelector('.ball-counter')
	playSound();
	gBallCount++
	elBallCounter.innerText = gBallCount
}

function ballCheck() {
	var elBallCounter = document.querySelector('.ball-counter')
	var occupiedBallCell = []

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j];

			if (currCell.type === FLOOR && currCell.gameElement === BALL) occupiedBallCell.push({ i: i, j: j })
		}
	}
	if (elBallCounter.innerText > 1) {
		if (occupiedBallCell.length === 0) {
			gameOver()
			console.log('GAME OVER!!!');
		}

	}
	return occupiedBallCell

}


function gameOver() {
	clearInterval(gAddBall);
	showModal()

}

function resetGame(elResBtn) {
	location.reload()
}



function showModal() {
	var elModal = document.querySelector('.modal')
	var elH3 = elModal.querySelector('h3')
	elModal.style.display = 'inline'

}


function playSound() {
	var sound = new Audio("sound/0.mp3");
	sound.play();
}