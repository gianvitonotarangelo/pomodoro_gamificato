# Gamification: Pomodoro Timer Web App

App web single-page per la tecnica del Pomodoro con elementi di gamification: punti, badge, barra di progresso e statistiche settimanali.

# Funzionalità principali

- Timer Pomodoro (25 minuti lavoro, 5 minuti pausa).
- Punti: +10 punti al completamento di ogni Pomodoro (solo a fine sessione di lavoro). 
- Badge sbloccabili e soglie di Pomodori completati (1, 5, 10, 20).  
- Barra di progresso basata su un ciclo di 10 pomodori completati.
- Persistenza con localStorage (punti, pomodori completati, badge sbloccati e dati settimanali) 
- Grafico settimanale dei Pomodori completati con Chart.js (caricato via CDN).

## Tecnologie utilizzate

- HTML5, CSS3, JavaScript (ES6). 
- Chart.js (via CDN) per il grafico settimanale.

## Requisiti

- Browser con supporto a JavaScript e localStorage
- Connessione internet se si usa la CDN di Chart.js (in `index.html`).

## Installazione ed esecuzione
1. Clona o scarica il repository: https://github.com/gianvitonotarangelo/gamification_pomodoro
2. Avvia aprendo `index.html` nel browser oppure tramite un server statico.

## Struttura del progetto
- `index.html`: markup dell’interfaccia (timer, pulsanti, area punti/badge, canvas del grafico) e inclusione di Chart.js + `script.js`.
- `style.css`: stile UI + classi per stati lavoro/pausa e animazione badge (`badge-animation`).
- `script.js`: logica timer, gamification, persistenza, aggiornamento grafico e micro-feedback.

## Dettagli implementativi

### Stato e persistenza (local Storage)
Chiavi principali usate:
- `points`: punti totali.
- `pomodorosCompleted`: numero di Pomodori completati.
- `unlockedBadges`: array dei badge sbloccati.
- `weeklyData`: array di 7 valori (Lun…Dom) per il grafico.

### Logica Pomodoro
- Alla fine della sessione di lavoro viene incrementato il contatore Pomodori e vengono assegnati i punti, poi si passa alla pausa.

### Statistiche settimanali
- Il giorno corrente viene calcolato con `Date.getDay()` e mappato a indice (Lun=0 … Dom=6) per aggiornare `weeklyData`.

## UX: micro-feedback e animazioni
- Messaggi brevi di feedback mostrati per ~3s.
- Animazione “bounce” quando si sblocca un badge.

## Note limitazioni
- Se Chart.js non è raggiungibile (offline), il grafico potrebbe non funzionare perché caricato via CDN.
- Il salvataggio è locale al browser/dispositivo (localStorage), quindi non è sincronizzato tra dispositivi.