let minutes = 25;
let seconds = 0;
let timer;
let points = 0;
let pomodorosCompleted = 0;

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const pointsEl = document.getElementById('points');
const badgeEl = document.getElementById('badge');
const progressEl = document.getElementById('progress');

function updateDisplay() {
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
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

function completePomodoro() {
    pauseTimer();
    points += 10;
    pomodorosCompleted++;
    pointsEl.textContent = points;

    // Aggiorna badge
    if (pomodorosCompleted === 5) badgeEl.textContent = '🥉 5 Pomodori';
    if (pomodorosCompleted === 10) badgeEl.textContent = '🥈 10 Pomodori';
    if (pomodorosCompleted === 20) badgeEl.textContent = '🥇 20 Pomodori';

    // Aggiorna barra dei progressi (ogni 5 pomodori = 100%)
    let progress = Math.min((pomodorosCompleted % 5) * 20, 100);
    progressEl.style.width = progress + '%';

    alert('Pomodoro completato! Prenditi una pausa.');
    resetTimer();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
