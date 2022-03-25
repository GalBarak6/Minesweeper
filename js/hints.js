'use strict'

var gHintsNum = 3
var isLightBulbs = false
var gRevealTimeId
var gBulbClass = 0
var gBulbs


//build an array of bulbs according to num of bulbs given
function buildBulbs(hintsNum) {
    var bulbs = []
    for (var i = 1; i <= hintsNum; i++) {
        var bulb = {
            num: i,
            isLightBulb: false
        }
        bulbs.push(bulb)
    }
    gBulbs = bulbs
}


//render bulbs to DOM with img + class + onlclick
function renderBulbs(hintsNum) {
    var elHints = document.querySelector('.hints')
    for (var i = 1; i <= hintsNum; i++) {
        elHints.innerHTML += `<img src="img/bulb.png" alt="" class="bulb bulb${i}" onclick="clickedBulb(this, ${i})">`
    }
}


//changing the img to light bulb when click a regular bulb
function clickedBulb(elImg, i) {
    if (!gGame.isOn) return
    if (isLightBulbs) return
    elImg.src = 'img/light-bulb.png'
    gBulbClass = i
    isLightBulbs = true
}


//revealing the clicked cell + his neighbours *if* a bulb has been clicked
function revealCells(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;

            board[i][j].isShown = true
            renderCell(i, j, 'visible', 'shown')
        }
    }
}


//removing the used bulb - changing back to normal bulb and hiding revealed cells -->after 1s
function removeUsedBulb(cellI, cellJ) {
    var elBulb = document.querySelector('.bulb' + gBulbClass)
    elBulb.style.opacity = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;

            gBoard[i][j].isShown = false
            renderRemoveDis(i, j, 'hidden', 'shown')
        }
    }
    isLightBulbs = false
    gBulbClass = 0
}


//restart the bulbs status to normal on init
function restartBulbStatus() {
    var elBulb = document.querySelectorAll('.bulb')
    for (var i = 0; i < elBulb.length; i++) {
        elBulb[i].src = 'img/bulb.png'
    }

    clearTimeout(gRevealTimeId)
    gRevealTimeId = null
    gBulbClass = 0
    isLightBulbs = false
}