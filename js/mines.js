'use strict'

const MINE = '💣'


//randing mines on the board
function addRandMines(minesCount, board, i, j) {
    for (var i = 0; i < minesCount; i++) {
        board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true
    }
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