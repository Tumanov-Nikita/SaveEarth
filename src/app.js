const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const canvas = document.querySelector("#canvasButton");
const myBar = document.querySelector("#myBar");
var i = 0;

window.onload = function() {
    setScore(getScore())
    initTimer();
    if (Number(localStorage.getItem('direction')) > 1)
    {
        processingProgressBar();
    }
}

function initTimer() {
    timerAction();
}

function timerAction() {
    var startDate = getStartDate();
    var currentDate = new Date().getTime();
    var dueDate = getDueDate();
    var direction = Number(localStorage.getItem('direction'));

    if (direction <= 0)
    {
        localStorage.setItem('direction', -1);
        setScore(getScore() - 0.01);
        setTimeout(timerAction, 1000);
    }
    else
    {
        if (dueDate - currentDate >= 0)
        {
            var farmValue = Number((currentDate / 1000) - (startDate / 1000)) / 10;
            if (startDate==currentDate==dueDate)
            {
                localStorage.setItem('startDate', startDate);
            }
            if (farmValue > 2160)
            {
                farmValue = 2160;
            }
            localStorage.setItem('farmValue', farmValue);
            setTimeout(timerAction, 1000);
        }
        else if (farmValue == 2160)
        {
            localStorage.setItem('direction', -1);
            myBar.textContent = "Забрать 2160 $OZON на баланс";
            setTimeout(timerAction, 1000);
        }
        else
        {
            setTimeout(timerAction, 1000);
        }
    }

    processingProgressBar();
}

farmButton.addEventListener('click', (event) => {
    console.log("Кнопка нажата");
    var direction = Number(localStorage.getItem('direction'));
    if (direction < 0)
    {
        var farmedValue = localStorage.getItem('farmValue') ?? 0;
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
    if (direction > 0)
    {
        var currentDate = new Date();
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
    var score = Number(localStorage.getItem('score'));
    if (score == 0)
    {
        return 1000;
    }
    else {
        return score;
    }
}

function getStartDate() {
    var startDate = localStorage.getItem('startDate');
    if (!startDate || startDate == NaN)
    {
        return new Date().getTime();
    }
    else 
    {
        return Date.parse(startDate);
    }
}

function getDueDate() {
    var dueDate = localStorage.getItem('dueDate');
    if (!dueDate || dueDate == NaN)
    {
        return new Date().getTime();
    }
    else 
    {
        return Date.parse(dueDate);
    }
}

function processingProgressBar() {
    var remainingTime = dateWithoutTimezone(new Date(getDueDate() - new Date().getTime()));
    var hours = remainingTime.getHours();
    var minutes = remainingTime.getMinutes();

    var farmValue = localStorage.getItem('farmValue');
    
    width = (Number.parseInt(farmValue)/2160)*100
    if (farmValue > 0)
    {
        myBar.style.width = width + "%";
        myBar.textContent = `Фарминг ${
            new Intl.NumberFormat("ru", {
                style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1
            }).format(farmValue)
        } / 2160\t${hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0')}`;
    }
}

function dateWithoutTimezone(date) {
    const tzoffset = date.getTimezoneOffset() * 60000;
    const withoutTimezone = new Date(date.valueOf() + tzoffset);
    return withoutTimezone;
}

