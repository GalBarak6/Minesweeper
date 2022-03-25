'use strict'

var gFirstClick = true
var gSafeClickTimeId
var gSafeClickCount = 3
var gElH3 = document.querySelector('.safe-click h3')

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
        timer()
    }
    if (cell.isShown) return
    if (cell.isMarked) return
    //     for (var i = 0; i < gBulbs.length; i++) {
    //     if (gBulbs[i].isLightBulb) {
    //         revealCells(gBoard, i, j)
    //         gRevealTimeId = setTimeout(removeUsedBulb, 1000, i, j)
    //         return
    //     }
    // }
    if (isLightBulbs) {
        revealCells(gBoard, i, j)
        gRevealTimeId = setTimeout(removeUsedBulb, 1000, i, j)
        return
    }

    var elSpan = elCell.querySelector('span')
    elSpan.style.visibility = 'visible'
    elCell.classList.add('shown')
    cell.isShown = true
    gGame.shownCount++

    if (elCell.classList.contains('empty')) expandShown(gBoard, elCell, i, j)
    if (cell.isMine) {
        if (gGame.lives && gIsLifeActive) {
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

    if (!gGame.isOn) return
    var cell = gBoard[i][j]
    var elSpan = elCell.querySelector('span')
    if (cell.isShown) return
    if (cell.isMarked) {
        gGame.markedCount--
        elSpan.style.visibility = 'visible'
        if (elCell.classList.contains('empty')) {
            elSpan.innerText = ''
            elSpan.style.visibility = 'hidden'
        } else if (elCell.classList.contains('mine')) {
            elSpan.innerText = MINE
            elSpan.style.visibility = 'hidden'
        } else {
            elSpan.innerText = cell.minesAroundCount
            elSpan.style.visibility = 'hidden'
        }
    } else {
        elSpan.innerText = FLAG
        elSpan.style.visibility = 'visible'
        gGame.markedCount++
    }

    cell.isMarked = !cell.isMarked
    checkGameOver()
}




//when stepping on empty - expanding neighbors
function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;


            renderCell(i, j, 'visible', 'shown')
            if (gBoard[i][j].isMarked) {
                if (!gBoard[i][j].minesAroundCount) renderText(i, j, '')
                else renderText(i, j, gBoard[i][j].minesAroundCount)
            }
            if (gBoard[i][j].isShown) gGame.shownCount--
            gBoard[i][j].isShown = true
            gGame.shownCount++
        }
    }
}



//activated when clicked on safeclick btn --> 3 times reveals a safe cell
function safeClick() {
    if (!gGame.isOn) return
    if (!gSafeClickCount) return
    var elSpan = gElH3.querySelector('.clickCount')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) {
                renderClass(i, j, 'blink')
                gSafeClickTimeId = setInterval(stopSafeClick, 2000, i, j)
                elSpan.innerText = +elSpan.innerText - 1
                gSafeClickCount--
                return
            }
        }
    }
}


//stop the time for blinking cell + removing this class from it
function stopSafeClick(i, j) {
    renderRemoveClass(i, j, 'blink')
    clearTimeout(gSafeClickTimeId)
    gSafeClickTimeId = null
}