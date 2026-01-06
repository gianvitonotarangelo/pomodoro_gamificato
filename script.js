let isBreak = false;
const statusEl = document.getElementById('status');

// VARIABILI
let minutes = 25;
let seconds = 0;
let timer = null;
let points = parseInt(localStorage.getItem('points'), 10) || 0;
let pomodorosCompleted = parseInt(localStorage.getItem('pomodorosCompleted'), 10) || 0;

const BADGES = [
  { threshold: 1, name: "🍅 Primo Pomodoro!" },
  { threshold: 5, name: "🔥 Continua così!" },
  { threshold: 10, name: "💪 Dieci pomodori completati" },
  { threshold: 20, name: "🚀 Venti pomodori completati" }
];

let unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges')) || [];

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

// FUNZIONI TIMER
function updateDisplay() {
  minutesEl.textContent = minutes.toString().padStart(2, '0');
  secondsEl.textContent = seconds.toString().padStart(2, '0');

  if (isBreak) {
    timerEl.classList.add('break');
    timerEl.classList.remove('work');
  } else {
    timerEl.classList.add('work');
    timerEl.classList.remove('break');
  }
}

function updateProgress() {
  const cycle = 10;
  const pct = ((pomodorosCompleted % cycle) / cycle) * 100;
  progressEl.style.width = `${pct}%`;

  pointsEl.textContent = points;

  if (unlockedBadges.length > 0) {
    badgeEl.textContent = unlockedBadges[unlockedBadges.length - 1];
  } else {
    badgeEl.textContent = 'Nessuno';
  }
}

// FUNZIONE MICRO-FEEDBACK
function showMessage(text) {
  messageEl.textContent = text;
  setTimeout(() => {
    // Evita di cancellare messaggi più recenti
    if (messageEl.textContent === text) messageEl.textContent = '';
  }, 3000);
}

// BADGE ANIMATO
function showBadge(text) {
  badgeEl.textContent = text;
  badgeEl.classList.add('badge-animation');
  setTimeout(() => badgeEl.classList.remove('badge-animation'), 2000);
}

function unlockBadge(badgeName) {
  unlockedBadges.push(badgeName);
  localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
  showBadge(badgeName);
  showMessage(`Nuovo badge sbloccato: ${badgeName}!`);
}

function checkBadges() {
  BADGES.forEach((badge) => {
    if (pomodorosCompleted >= badge.threshold && !unlockedBadges.includes(badge.name)) {
      unlockBadge(badge.name);
    }
  });
}

// GRAFICO SETTIMANALE
const ctx = document.getElementById('chart').getContext('2d');
let weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || [0, 0, 0, 0, 0, 0, 0]; // Lun-Dom

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
    datasets: [{
      label: 'Pomodori completati',
      data: weeklyData,
      backgroundColor: '#ff6b6b'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

function updateChart() {
  const day = new Date().getDay(); // 0=Dom, 1=Lun
  const index = day === 0 ? 6 : day - 1;
  weeklyData[index] += 1;

  localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
  chart.data.datasets[0].data = weeklyData;
  chart.update();
}

// TIMER
function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        completePomodoro();
        return;
      }
      minutes -= 1;
      seconds = 59;
    } else {
      seconds -= 1;
    }

    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  isBreak = false;
  statusEl.textContent = 'Sessione di lavoro';
  minutes = 25;
  seconds = 0;
  updateDisplay();
  updateProgress();
}
// COMPLETAMENTO POMODORO
function completePomodoro() {
  pauseTimer();

  if (!isBreak) {
    // FINE LAVORO
    points += 10;
    pomodorosCompleted += 1;

    localStorage.setItem('points', points);
    localStorage.setItem('pomodorosCompleted', pomodorosCompleted);

    checkBadges();
    updateChart();
    showMessage('Pomodoro completato! Ottimo lavoro');

    statusEl.textContent = 'Pausa (5 minuti)';
    minutes = 5;
    seconds = 0;
    isBreak = true;
  } else {
    // FINE PAUSA
    showMessage('Torniamo al lavoro');
    statusEl.textContent = 'Sessione di lavoro';
    minutes = 25;
    seconds = 0;
    isBreak = false;
  }

  updateDisplay();
  updateProgress();
}

// EVENT LISTENER
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
updateProgress();
