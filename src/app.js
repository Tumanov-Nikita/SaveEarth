const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');

window.onload = function() {
    setScore(getScore())
    initTimer();
}

function setScore(scoreValue) {
    if (scoreValue < 0){
        return;
    }
    localStorage.setItem('score', scoreValue);
    score.textContent = new Intl.NumberFormat("ru", {style: "decimal", minimumFractionDigits: 2}).format(scoreValue) + " $OZON";
}

function getScore() {
    return Number(localStorage.getItem('score')) ?? 1000
}

function initTimer() {
    timerAction();
}

function timerAction() {
    setScore(getScore() - 0.01)
    setTimeout(timerAction, 1000);
}

farmButton.addEventListener('click', (event) => {
    
})
