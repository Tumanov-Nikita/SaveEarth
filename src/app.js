const homeScreen = document.querySelector("#homeScreen");
const tasksScreen = document.querySelector("#tasksScreen");
const friendsScreen = document.querySelector("#friendsScreen");
const ratingScreen = document.querySelector("#ratingScreen");
const walletScreen = document.querySelector("#walletScreen");
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const homeButton = document.querySelector('#homeButton');
const tasksButton = document.querySelector('#tasksButton');
const friendsButton = document.querySelector('#friendsButton');
const ratingButton = document.querySelector('#ratingButton');
const walletButton = document.querySelector('#walletButton');
const myBar = document.querySelector("#myBar");
const modif = 1;






window.onload = function() {
    setScore(getScore())
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
        if (startDate==currentDate && currentDate==dueDate)
        {
            startDate = addMinutesToDate(currentDate, (Number(localStorage.getItem('farmedScore')) * 100)/ 60)
            localStorage.setItem('startDate', startDate);
            localStorage.setItem('farmedScore', getScore());
        }
       
        var farmedScore = floorToDecimalPlaces(Number(localStorage.getItem('farmedScore')), 2);
        var lostScore = floorToDecimalPlaces(Number((currentDate / 1000) - (startDate / 1000)) / 100, 2);
        setScore(floorToDecimalPlaces(Number(farmedScore) - Number(lostScore), 2));

        
        localStorage.setItem('direction', -1);
        setTimeout(timerAction, 1000);
    }
    else
    {
        var farmValue = floorToDecimalPlaces(Number((currentDate / 1000) - (startDate / 1000)) / 10, 2);
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
            localStorage.setItem('startDate', startDate + 60 * modif * 1000);
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
        if (farmValue > 6 * modif)
        {
            farmValue = 6 * modif;
        }
        setScore(floorToDecimalPlaces(getScore() + Number.parseInt(farmValue), 2));
        localStorage.setItem('farmValue', 0);
        setDeltaScore(1);
        processingProgressBarText();
        processingProgressBarWidth();
    }
})

homeButton.addEventListener('click', (event) => {
    console.log("Кнопка Главная нажата");
    changeScreen("homeScreen");
})

tasksButton.addEventListener('click', (event) => {
    console.log("Кнопка Задачи нажата");
    changeScreen("tasksScreen");
})

friendsButton.addEventListener('click', (event) => {
    console.log("Кнопка Друзья нажата");
    changeScreen("friendsScreen");
})

ratingButton.addEventListener('click', (event) => {
    console.log("Кнопка Рейтинг нажата");
    changeScreen("ratingScreen");
})

walletButton.addEventListener('click', (event) => {
    console.log("Кнопка Кошелек нажата");
    changeScreen("walletScreen");
})

function changeScreen(screen) {
    switch (screen) {
        case "homeScreen":
            homeScreen.style.display = "block";
            tasksScreen.style.display = "none";
            friendsScreen.style.display = "none";
            ratingScreen.style.display = "none";
            walletScreen.style.display = "none";
            break;
        case "tasksScreen":
            homeScreen.style.display = "none";
            tasksScreen.style.display = "block";
            friendsScreen.style.display = "none";
            ratingScreen.style.display = "none";
            walletScreen.style.display = "none";
            break;
        case "friendsScreen":
            homeScreen.style.display = "none";
            tasksScreen.style.display = "none";
            friendsScreen.style.display = "block";
            ratingScreen.style.display = "none";
            walletScreen.style.display = "none";
            break;
        case "ratingScreen":
            homeScreen.style.display = "none";
            tasksScreen.style.display = "none";
            friendsScreen.style.display = "none";
            ratingScreen.style.display = "block";
            walletScreen.style.display = "none";
            break;
        case "walletScreen":
            homeScreen.style.display = "none";
            tasksScreen.style.display = "none";
            friendsScreen.style.display = "none";
            ratingScreen.style.display = "none";
            walletScreen.style.display = "block";
            break;
        default:
            break;
    }

}


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

function floorToDecimalPlaces(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(number * multiplier) / multiplier;
}

