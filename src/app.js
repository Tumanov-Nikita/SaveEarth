const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const canvas = document.querySelector("#canvasButton");
const myBar = document.querySelector("#myBar");
var i = 0;

window.onload = function() {
    setScore(getScore())
    initTimer();
    processingProgressBar();
}

function initTimer() {
    timerAction();
}

function timerAction() {
    var startDate = Date.parse(localStorage.getItem('startDate')) ?? new Date().getTime();
    var currentDate = new Date().getTime();
    var dueDate = Date.parse(localStorage.getItem('dueDate')) ?? new Date().getTime();
    var direction = Number(localStorage.getItem('direction'));
    var initialScore = Number(localStorage.getItem('initialScore')) ?? getScore();

    if (direction < 0)
    {
        setScore(getScore() - 0.01);
        setTimeout(timerAction, 1000);
    }
    else
    {
        if (dueDate - Date.now() >= 0)
        {
            var farmValue = Number((currentDate / 1000) - (startDate / 1000)) / 10;
            localStorage.setItem('farmValue', farmValue);
            setTimeout(timerAction, 1000);
        }
        else
        {
            localStorage.setItem('direction', -1);
            myBar.textContent = "Забрать 2160 $OZON на баланс";
            setTimeout(timerAction, 1000);
        }
    }
}

farmButton.addEventListener('click', (event) => {
    console.log("Кнопка нажата");
    var direction = Number(localStorage.getItem('direction'));
    if (direction < 0)
    {
        var farmedValue = localStorage.getItem('farmValue');
        setScore(getScore() + Number.parseInt(farmedValue));
        localStorage.setItem('initialScore', getScore());
        setDeltaScore(1);
        processingProgressBar();
    }
})

function addMinutesToDate(date, minutes) {
    const minutesToAdd = minutes * 60 * 1000;
    date.setTime(date.getTime() + minutesToAdd);
    return date;
}

function setDeltaScore(direction) {
    var currentDate = new Date();
    if (direction > 0)
    {
        localStorage.setItem('startDate', currentDate)
        var dueDate = addMinutesToDate(currentDate, 360);
        localStorage.setItem('dueDate', dueDate);
        localStorage.setItem('direction', direction);
    }
}

function setScore(scoreValue) {
    if (scoreValue < 0){
        return;
    }
    localStorage.setItem('score', scoreValue);
    score.textContent = new Intl.NumberFormat("ru", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(scoreValue) + " $OZON";
}

function getScore() {
    return Number(localStorage.getItem('score')) ?? 1000
}

function processingProgressBar() {
    var width = 0;
    var id = setInterval(frame, 10);

    function frame() {
        if (width >= 100) {
        clearInterval(id);
        i = 0;
        } else {
            var currentDate = new Date().getTime();
            var dueDate = Date.parse(localStorage.getItem('dueDate')) ?? new Date().getTime();
            var remainingTime = dateWithoutTimezone(new Date(dueDate - currentDate));
            var hours = remainingTime.getHours();
            var minutes = remainingTime.getMinutes();

            var farmValue = new Intl.NumberFormat("ru", {style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1}).format(localStorage.getItem('farmValue'));
            width = (Number.parseInt(farmValue)/2160)*100
            myBar.style.width = width + "%";
            myBar.textContent = `Фарминг ${farmValue} / 2160\t${hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0')}`;
        }
    }
}

function dateWithoutTimezone(date) {
    const tzoffset = date.getTimezoneOffset() * 60000;
    const withoutTimezone = new Date(date.valueOf() + tzoffset);
    return withoutTimezone;
}

