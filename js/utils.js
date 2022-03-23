'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function renderCell(i, j, value1, value2) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    var elSpan = elCell.querySelector('span')
    elSpan.style.visibility = value1
    elCell.classList.add(value2)
}



function pad(value) {
    var string = value + ''
    if (string.length < 2) {
        return '0' + string
    } else {
        return string
    }
}