const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const canvas = document.querySelector("#canvasButton");
const myBar = document.querySelector("#myBar");
const modif = 360;

window.onload = function() {
    setScore(getScore())
    localStorage.setItem('dueDate', getDueDate());
    localStorage.setItem('farmedScore', getScore());
    initTimer();
    if (Number(localStorage.getItem('direction')) > 1)
    {
        processingProgressBarWidth();
    }
    processingProgressBarText();
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
        var farmedScore = localStorage.getItem('farmedScore');
        var lostScore = Number((currentDate / 1000) - (dueDate / 1000)) / 100;
        setScore(Number(farmedScore) - Number(lostScore));
        
        localStorage.setItem('direction', -1);
        setTimeout(timerAction, 1000);
    }
    else
    {
        var farmValue = Number((currentDate / 1000) - (startDate / 1000)) / 10;
        if (dueDate - currentDate >= 0)
        {
            if (startDate==currentDate && currentDate==dueDate)
            {
                localStorage.setItem('startDate', startDate);
            }
            if (farmValue > 6 * modif)
            {
                farmValue = 6 * modif;
            }
            localStorage.setItem('farmValue', farmValue);
            processingProgressBarText();
            setTimeout(timerAction, 1000);
        }
        else if (farmValue >= 6 * modif)
        {
            localStorage.setItem('direction', -1);
            localStorage.setItem('farmValue', farmValue);
            localStorage.setItem('farmedScore', getScore());
            myBar.textContent = `Забрать ${6 * modif} $OZON на баланс`;
            setTimeout(timerAction, 1000);
        }
        else
        {
            setTimeout(timerAction, 1000);
            processingProgressBarText();
        }
    }
    processingProgressBarWidth();
}

farmButton.addEventListener('click', (event) => {
    console.log("Кнопка нажата");
    var direction = Number(localStorage.getItem('direction'));
    if (direction < 0)
    {
        var farmValue = localStorage.getItem('farmValue') ?? 0;
        setScore(getScore() + Number.parseInt(farmValue));
        setDeltaScore(1);
        processingProgressBarText();
        processingProgressBarWidth();
    }
})

function addMinutesToDate(date, minutes) {
    const minutesToAdd = minutes * 60 * 1000;
    date += minutesToAdd;
    return date;
}

function setDeltaScore(direction) {
    if (direction > 0)
    {
        var currentDate = new Date();
        localStorage.setItem('startDate', currentDate.getTime())
        var dueDate = addMinutesToDate(currentDate.getTime(), modif);
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
    var startDate = Number(localStorage.getItem('startDate'));
    if (isNaN(startDate) || startDate == 0)
    {
        return new Date().getTime();
    }
    else 
    {
        return startDate;
    }
}

function getDueDate() {
    var dueDate = Number(localStorage.getItem('dueDate'));
    if (isNaN(dueDate) || dueDate == 0)
    {
        return new Date().getTime();
    }
    else 
    {
        return dueDate;
    }
}

function getRemainingTimeString() {
    var remainingTime = new Date(dateWithoutTimezone(getDueDate() - new Date().getTime()));
    var hours = remainingTime.getHours();
    var minutes = remainingTime.getMinutes();

    return `${hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0')}`
}

function processingProgressBarText() {
    var farmValue = Number(localStorage.getItem('farmValue'));
    if (farmValue >= 6*modif)
    {
        myBar.textContent = `Забрать ${6 * modif} $OZON на баланс`;
    }
    else if (Number(localStorage.getItem('direction')) > 0)
    {
        myBar.textContent = `Фарминг ${
            new Intl.NumberFormat("ru", {
                style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1
            }).format(farmValue)
        } / ${6*modif}\t${getRemainingTimeString()}`;
    }
    else
    {
        myBar.textContent = "Начать фарминг озонового слоя";
    }
}

function processingProgressBarWidth() {
    var farmValue = localStorage.getItem('farmValue');
    
    width = (Number.parseInt(farmValue)/(6*modif))*100
    if (farmValue > 0)
    {
        myBar.style.width = width + "%";
    }
}

function dateWithoutTimezone(date) {
    var dateWithTimezone = new Date(date);
    const tzoffset = dateWithTimezone.getTimezoneOffset() * 60000;
    const withoutTimezone = dateWithTimezone.valueOf() + tzoffset;
    return withoutTimezone;
}

