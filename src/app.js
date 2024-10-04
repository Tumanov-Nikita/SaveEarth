const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const canvas = document.querySelector("#canvasButton");
var i = 0;

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

farmButton.addEventListener('click', (event) => {
    console.log("Кнопка нажата");
    move();
})

function getScore() {
    return Number(localStorage.getItem('score')) ?? 1000
}

function initTimer() {
    timerAction();
}

function timerAction() {
    setScore(getScore() - 0.01);
    setTimeout(timerAction, 1000);
}


function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("farmButton");
        var width = 1;
        var id = setInterval(frame, 10);      
        
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            i = 0; //#00DDEB
            } else {
                width++;
                var ctx = canvas.getContext("2d");
                var gradient = ctx.createLinearGradient(0, 0, width, 0);
                // Добавление трёх контрольных точек
                gradient.addColorStop(0, "green");
                gradient.addColorStop(0.5, "cyan");
                gradient.addColorStop(1, "green");

                // Установка стиля заливки и отрисовка прямоугольника градиента
                ctx.fillStyle = gradient;
                ctx.fillRect(20, 20, 200, 100);
            }
        }
    }
}

