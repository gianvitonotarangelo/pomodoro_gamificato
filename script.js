let isBreak = false;
const statusEl = document.getElementById('status');// --------------------

// VARIABILI
let minutes = 25;
let seconds = 0;
let timer;
let points = parseInt(localStorage.getItem('points')) || 0;
let pomodorosCompleted = parseInt(localStorage.getItem('pomodorosCompleted')) || 0;

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const pointsEl = document.getElementById('points');
const badgeEl = document.getElementById('badge');
const progressEl = document.getElementById('progress');
const timerEl = document.querySelector('.timer');
const messageEl = document.getElementById('message');

pointsEl.textContent = points;


// FUNZIONI TIMER
function updateDisplay() {
    minutesEl.textContent = minutes.toString().padStart(2,'0');
    secondsEl.textContent = seconds.toString().padStart(2,'0');

    if (isBreak) {
        timerEl.classList.add('break');
        timerEl.classList.remove('work');
    } else {
        timerEl.classList.add('work');
        timerEl.classList.remove('break');
    }
}

function startTimer() {
    if(timer) return;
    timer = setInterval(() => {
        if(seconds === 0){
            if(minutes === 0){
                completePomodoro();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    pauseTimer();
    minutes = 25;
    seconds = 0;
    updateDisplay();
}


// COMPLETAMENTO POMODORO

function completePomodoro() {
    pauseTimer();

    if (!isBreak) {
        points += 10;
        pomodorosCompleted++;
        localStorage.setItem('points', points);
        localStorage.setItem('pomodorosCompleted', pomodorosCompleted);
        pointsEl.textContent = points;
        updateChart();

        showMessage('Pomodoro completato! Ottimo lavoro');
        statusEl.textContent = ' Pausa (5 minuti)';
        minutes = 5;
        isBreak = true;
    } else {
        // FINE PAUSA
        showMessage('Torniamo al lavoro');
        statusEl.textContent = ' Sessione di lavoro';
        minutes = 25;
        isBreak = false;
    }

    seconds = 0;
    updateDisplay();
    startTimer();
}



// BADGE ANIMATO

function showBadge(text) {
    badgeEl.textContent = text;
    badgeEl.classList.add('badge-animation');
    setTimeout(() => badgeEl.classList.remove('badge-animation'), 2000);
}


// EVENT LISTENER

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();


// GRAFICO SETTIMANALE

const ctx = document.getElementById('chart').getContext('2d');
let weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || [0,0,0,0,0,0,0]; // Lun-Dom

const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'],
        datasets: [{
            label: 'Pomodori completati',
            data: weeklyData,
            backgroundColor: '#ff6b6b'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true, stepSize: 1 }
        }
    }
});

function updateChart() {
    const day = new Date().getDay(); // 0=Dom, 1=Lun
    const index = day === 0 ? 6 : day-1;
    weeklyData[index]++;
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
    chart.data.datasets[0].data = weeklyData;
    chart.update();
}

// FUNZIONE MICRO-FEEDBACK
function showMessage(text) {
    messageEl.textContent = text;
    setTimeout(() => messageEl.textContent = '', 3000);
}
