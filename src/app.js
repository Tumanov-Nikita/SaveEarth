const circle = document.querySelector('#circle');
const score = document.querySelector('#score');
const farmButton = document.querySelector('#farmButton');
const canvas = document.querySelector("#canvasButton");
var i = 0;

window.onload = function() {
    setScore(getScore())
    initTimer();
    processingProgressBar();
}

function addMinutesToDate(date, minutes) {
    const minutesToAdd = minutes * 60 * 1000;
    date.setTime(date.getTime() + minutesToAdd);
    return date;
}

function setDeltaScore(direction) {
    var currentDate =new Date();
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
    score.textContent = new Intl.NumberFormat("ru", {style: "decimal", minimumFractionDigits: 2}).format(scoreValue) + " $OZON";
}

farmButton.addEventListener('click', (event) => {
    console.log("Кнопка нажата");
    setDeltaScore(1);
    processingProgressBar();
})

function getScore() {
    return Number(localStorage.getItem('score')) ?? 1000
}

function initTimer() {
    timerAction();
}

function timerAction() {
    var dueDate = Date.parse(localStorage.getItem('dueDate')) ?? new Date();
    var direction = Number(localStorage.getItem('direction'));

    if (direction < 0)
    {
        setScore(getScore() - 0.01);
        setTimeout(timerAction, 1000);
    }
    else
    {
        if (dueDate - Date.now() >= 0)
        {
            setScore(getScore() + 0.1);
            setTimeout(timerAction, 1000);
            localStorage.setItem('farmValue', Number(localStorage.getItem('farmValue')) + 0.1);
        }
        else
        {
            localStorage.setItem('direction', -1);
            setTimeout(timerAction, 1000);
        }
    }
}


function processingProgressBar() {
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 0;
      var id = setInterval(frame, 10);
  
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
            var startDate = Date.parse(localStorage.getItem('startDate')) ?? new Date();
            var dueDate = Date.parse(localStorage.getItem('dueDate')) ?? new Date();
            var currentDate = new Date();
            var percent = ((currentDate.getTime() - startDate)/(dueDate - startDate)) * 100;
            elem.style.width = percent + "%";
            var farmValue = new Intl.NumberFormat("ru", {style: "decimal", minimumFractionDigits: 1}).format(localStorage.getItem('farmValue'));
            elem.textContent = `Фарминг ${farmValue} / 2160`;
        }
      }
    }
  }

