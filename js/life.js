'use strict'

var gIsLifeActive = false



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
    gGame.minesSaved++
}



//When clicked activate life - checking if already activated and changing text
function activateLife(elBtn) {
    if (!gIsLifeActive) {
        gIsLifeActive = true
        elBtn.innerText = 'Deactivate!'
    } else {
        gIsLifeActive = false
        elBtn.innerText = 'Activate Life!'
    }

}
