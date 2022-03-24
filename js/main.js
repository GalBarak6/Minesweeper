'use strict'

//***** TODO --> FIX THE PROBLEM WHERE EXPANDING CELLS TO DELETE THE FLAGS
//***** TODO --> ADD THE FEATURE OF FIRST TURN IS NEVER A MIND + TRY A BIT OF THE BONUSES
//***** TODO --> DESIGN THE WHOLE WEB!!


const MINE = '💣'
const FLAG = '🚩'
const LIFE = '🧬'
const NORMAL = '🙂'
const LOSE = '😭'
const WIN = '🥳'

var gBoard
var gFirstClick = true
var gTimerInterval
var gStartTime = 0
var gIsWin = null
var gElSmiley = document.querySelector('.smiley')

var gLevel = {
    SIZE: 4,
    MINES: 2
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    SecsPassed: 0,
    lives: 3
}


// Onload
function init() {
    closeModal()
    gBoard = buildBoard()
    // addRandMines(gLevel.MINES, gBoard)
    setMinesNegCount(gBoard)
    renderBoard(gBoard)
    gGame.lives = 3
    buildLives(gGame.lives)
    clearInterval(gTimerInterval)
    document.querySelector('.seconds').innerText = '00'
    document.querySelector('.minutes').innerText = '00'
    gTimerInterval = null
    gFirstClick = true
    gGame.isOn = true
    gStartTime = 0
    gGame.SecsPassed = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    gElSmiley.innerText = NORMAL
}


// Building our model board
function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    addRandMines(gLevel.MINES, board)
    // board[1][1].isMine = true
    // board[2][3].isMine = true
    return board
}


// Rendering the board to HTML shape
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell';
            if (cell.isMine) {
                cell = MINE
                className += ' mine'
            } else if (!cell.minesAroundCount) {
                cell = ''
                className += ' empty'
            } else {
                cell = cell.minesAroundCount
                switch (cell) {
                    case 1:
                        className += ' num num1'
                        break;
                    case 2:
                        className += ' num num2'
                        break;
                    case 3:
                        className += ' num num3'
                        break;
                    case 4:
                        className += ' num num4'
                        break;
                    case 5:
                        className += ' num num5'
                        break;
                    case 6:
                        className += ' num num6'
                        break;
                    case 7:
                        className += ' num num7'
                        break;
                    case 8:
                        className += ' num num8'
                        break;
                }
                // }
                // if(cell === 1) className += ' num num1'
                // if(cell === 2) className += ' num num2'
                // if(cell === 3) className += ' num num3'
                // if(cell === 4) className += ' num num4'
                // className += ' num'
            }
            strHTML += `<td class=" ${className} " data-i="${i}" data-j="${j}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"> <span>${cell}</span></td>`
        }
        strHTML += '</tr>'
    }
    var elCells = document.querySelector('.cells');
    elCells.innerHTML = strHTML;
}


//setting the num of neighbours by running countNeighbors on each cell on the board
function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = countNeighbors(i, j, board)
        }
    }
}


// count the neighbours around a specific cell
function countNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;

            if (board[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

//onclick cells
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]
    if (gFirstClick) {
        gFirstClick = false
        while (cell.isMine) {
            gBoard = buildBoard()
            setMinesNegCount(gBoard)
            renderBoard(gBoard)
            cell = gBoard[i][j]
        }
        renderCell(i, j, 'visible', 'shown')
    }
    if (cell.isShown) return
    if (cell.isMarked) return

    var elSpan = elCell.querySelector('span')
    elSpan.style.visibility = 'visible'
    elCell.classList.add('shown')
    cell.isShown = true
    gGame.shownCount++

    if (elCell.classList.contains('empty')) expandShown(gBoard, elCell, i, j)
    if (cell.isMine) {
        if (gGame.lives) {
            useLife()
        } else {
            exposeAllMines()
            loseGame()
        }

    }
    checkGameOver()
}

//marking the cells(right mouse click)
function cellMarked(elCell, i, j) {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

    var cell = gBoard[i][j]
    var elSpan = elCell.querySelector('span')
    if (cell.isShown) return
    if (cell.isMarked) {
        gGame.markedCount--
        elSpan.style.visibility = 'visible'
        if (elCell.classList.contains('empty')) {
            elSpan.textContent = ''
        } else if (elCell.classList.contains('mine')) {
            elSpan.textContent = MINE
        } else {
            elSpan.textContent = cell.minesAroundCount
        }
    } else {
        elSpan.textContent = FLAG
        // elSpan.style.visibility = 'visible'
        gGame.markedCount++
    }

    cell.isMarked = !cell.isMarked
    checkGameOver()
}

//immediate lose when stepping a mine
function loseGame() {
    gElSmiley.innerText = LOSE
    gIsWin = false
    gGame.isOn = false
    openModal()
    return
}

//checking if won the game by the rules - marked mines and shown cells(unless shown mines are saved by lives)
function checkGameOver() {
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if ((cell.isMarked && cell.isMine)) {
                count++
            }
        }
    }
    if (count === gLevel.MINES && gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        gIsWin = true
        gGame.isOn = false
        openModal()
    }
}

//when stepping on empty - expanding neighbors
function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;


            renderCell(i, j, 'visible', 'shown')
            // var elCurr = getInnerText(i, j)
            // console.log(elCurr);
            // console.log(gBoard[i][j].isMarked);
            if (gBoard[i][j].isMarked) {
                //     gBoard[i][j].isMarked = false
                //     renderText(i, j, elCurr)
                //     console.log(elCurr);
                // renderCell(i, j, 'hidden', 'shown')
            }
            if (gBoard[i][j].isShown) gGame.shownCount--
            gBoard[i][j].isShown = true
            gGame.shownCount++
        }
    }
}

//randing mines on the board
function addRandMines(minesCount, board, i, j) {
    for (var i = 0; i < minesCount; i++) {
        board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true
    }
}


//set timer counting up
function timer() {
    var elMinutes = document.querySelector('.minutes')
    var elSeconds = document.querySelector('.seconds')
    gStartTime = Date.now()
    gTimerInterval = setInterval(function () {
        var timeDiff = Date.now() - gStartTime
        var currTime = new Date(timeDiff)
        elSeconds.innerText = pad(currTime.getSeconds())
        elMinutes.innerText = pad(currTime.getMinutes())
        gGame.SecsPassed++
    }, 1000);

}


//exposing all the mines when stepping on one(and losing..bummer)
function exposeAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                renderCell(i, j, 'visible', 'shown')
                gGame.shownCount++
            }
        }
    }
}

//open modal of you lose/win
function openModal() {
    var elModal = document.querySelector('.modal')
    if (!gIsWin) {
        elModal.innerText = 'You Lost!'
        elModal.style.visibility = 'visible'
    } else {
        elModal.innerText = 'You Won!'
        elModal.style.visibility = 'visible'
    }
}

//closing modal
function closeModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.visibility = 'hidden'
}

//restart smiley
function restart(elSmiley) {
    elSmiley.innerText = NORMAL
    clearInterval(gTimerInterval)
    init()
}

//diffuclty changes by buttons
function difficultyLevels(elBtn) {
    var elBoard = document.querySelector('.board')
    if (elBtn.classList.contains('level1')) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        elBoard.style.padding = 100 + 'px'
    } else if (elBtn.classList.contains('level2')) {
        gLevel.SIZE = 8
        gLevel.MINES = 12
        elBoard.style.padding = 30 + 'px'
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 30
        elBoard.style.padding = 10 + 'px'
    }
    clearInterval(gTimerInterval)
    init()
}

//building the lives inline img dynamic(if we wanna add/decrease lives for the player)
function buildLives(livesCount) {
    var elLives = document.querySelector('.lives')
    var lives = ''
    for (var i = 0; i < livesCount; i++) {
        lives += LIFE
    }
    elLives.innerText = lives
}

//the actual function for using the life after stepping on a mine
function useLife() {
    gGame.lives--
    buildLives(gGame.lives)
}

