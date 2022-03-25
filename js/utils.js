'use strict'

//get rand num between a range not including max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


//render cell visability + adding shown class to add click color
function renderCell(i, j, value1, value2) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    var elSpan = elCell.querySelector('span')
    elSpan.style.visibility = value1
    elCell.classList.add(value2)
}


//render cell visabillty + removing shown class to unselect a cell
function renderRemoveDis(i, j, value1, value2) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    var elSpan = elCell.querySelector('span')
    elSpan.style.visibility = value1
    elCell.classList.remove(value2)
}


//render cell inner text to change to content
function renderText(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    var elSpan = elCell.querySelector('span')
    elSpan.innerText = value
}


//sub function for timer to add zeroes
function pad(value) {
    var string = value + ''
    if (string.length < 2) {
        return '0' + string
    } else {
        return string
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



//render a specific class to a cell for safe click!
function renderClass(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.classList.add(value)
}


//render removing a specific class from a cell for safe click!
function renderRemoveClass(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.classList.remove(value)
    console.log(elCell);
}