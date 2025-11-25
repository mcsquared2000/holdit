// --- VARIABLES ---
let isPlaying = false;
let startTime;
let timerInterval;
let elapsedTime = 0;

// --- DOM ELEMENTS ---
const theButton = document.getElementById('the-button');
const timerDisplay = document.getElementById('timer');
const statusText = document.getElementById('status-text');
const gameContainer = document.querySelector('.game-container');
const batteryPopup = document.getElementById('fake-battery-popup');

// --- EVENT LISTENERS ---
// We use pointer events for better cross-device handling (touch and mouse)

// START Holding
theButton.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // Prevents weird browser behaviors on touch
    if (!isPlaying) {
        startGame();
    }
});

// STOP Holding (These trigger GAME OVER)
// If they lift their finger/mouse anywhere on the screen
document.addEventListener('pointerup', stopGame);
// If their finger leaves the browser window entirely
document.addEventListener('pointercancel', stopGame);
document.addEventListener('pointerleave', stopGame);


// --- CORE FUNCTIONS ---

function startGame() {
    isPlaying = true;
    startTime = Date.now();
    statusText.textContent = "Hold tight...";
    // Add a class to visually show it's being held (helps on mobile)
    theButton.classList.add('holding-active');
    
    // Reset sabotage elements
    resetSabotage();

    // Start the timer loop
    timerInterval = setInterval(updateTimer, 50); // Update every 50ms
}

function stopGame() {
    if (isPlaying) {
        isPlaying = false;
        clearInterval(timerInterval);
        statusText.textContent = `GAME OVER! You lasted ${elapsedTime.toFixed(2)}s`;
        statusText.style.color = "#ff3b3b";
        theButton.classList.remove('holding-active');

        // Final massive vibration if supported (Android only usually)
        if (navigator.vibrate) navigator.vibrate(500);
        
        // Reset sabotage elements after a short delay so they see what killed them
        setTimeout(resetSabotage, 1500);
    }
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = (currentTime - startTime) / 1000;
    timerDisplay.textContent = elapsedTime.toFixed(2) + 's';

    // Run the sabotage check
    runSabotageLogic(elapsedTime);
}

// --- THE SABOTAGE LOGIC ---
// This checks the time and escalates the difficulty
function runSabotageLogic(time) {

    // --- Phase 1: Mild annoyance (5 seconds) ---
    if (time > 5 && time < 10) {
       statusText.textContent = "Is that all you got?";
       // Short blip vibration
       if (navigator.vibrate && Math.random() > 0.95) navigator.vibrate(50);
    }

    // --- Phase 2: Movement begins (10 seconds) ---
    if (time > 10 && time < 18) {
        statusText.textContent = "Uh oh, it's slipping...";
        // Add CSS class to make the button drift around
        if (!theButton.classList.contains('moving-button')) {
            theButton.classList.add('moving-button');
        }
        // More frequent vibrations
        if (navigator.vibrate && Math.random() > 0.90) navigator.vibrate(100);
    }

     // --- Phase 3: The Fakeout (18 seconds) ---
     // This is the killer. It pops up over the button. 
     // If they tap "Close", they lifted their finger. Game over.
     if (time > 18 && time < 18.1) {
         statusText.textContent = "SYSTEM ERROR";
         batteryPopup.classList.remove('hidden');
         // Long vibration to sell the fake alert
         if (navigator.vibrate) navigator.vibrate(400);
     }

     // --- Phase 4: Chaos (25 seconds+) ---
     if (time > 25) {
        batteryPopup.classList.add('hidden'); // hide the battery if they survived it
        statusText.textContent = "WHY ARE YOU STILL HERE?";
        // Shake the whole screen
        if (!gameContainer.classList.contains('screen-shake')) {
            gameContainer.classList.add('screen-shake');
        }
        // Constant pulse vibration
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
     }
}


// Used to reset the board back to normal state
function resetSabotage() {
    statusText.style.color = "#eee";
    theButton.classList.remove('moving-button');
    gameContainer.classList.remove('screen-shake');
    batteryPopup.classList.add('hidden');
    // Stop any ongoing vibrations
    if (navigator.vibrate) navigator.vibrate(0);
}

// Prevent context menu on long press (especially important on Android Chrome)
window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};