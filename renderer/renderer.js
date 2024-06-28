const letters = '01234ABCDEFGHIJKLM56789NOPQRSTUVWXYZ␣'.split('');
let currentKeys = letters;
let selectedKeys = '';  

let gazeStartTime = null;
let gazeDirection = null;
const GAZE_DURATION_THRESHOLD = 2000; // 1 second

function updateKeyboard() {
    const leftZone = document.querySelector('.left-zone');
    const rightZone = document.querySelector('.right-zone');
    const midpoint = Math.floor(currentKeys.length / 2);

    leftZone.textContent = currentKeys.slice(0, midpoint).join(' ');
    rightZone.textContent = currentKeys.slice(midpoint).join(' ');
}

function updateSelectedKeys() {
    document.getElementById('text-input').value = selectedKeys;
}

function resetKeyboard() {
    currentKeys = letters;
    updateKeyboard();
}

function highlightZone(direction) {
    const leftZone = document.querySelector('.left-zone');
    const rightZone = document.querySelector('.right-zone');

    if (direction === 'left') {
        leftZone.style.backgroundColor = 'yellow';
        rightZone.style.backgroundColor = 'lightgreen';
    } else if (direction === 'right') {
        leftZone.style.backgroundColor = 'lightblue';
        rightZone.style.backgroundColor = 'yellow';
    } else {
        leftZone.style.backgroundColor = 'lightblue';
        rightZone.style.backgroundColor = 'lightgreen';
    }
}

webgazer.setGazeListener((data, elapsedTime) => {
    if (data == null) return;

    const x = data.x;
    const keyboard = document.getElementById('keyboard');
    const rect = keyboard.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    let currentGazeDirection = x < midX ? 'left' : 'right';

    // Highlight the zone being looked at
    highlightZone(currentGazeDirection);

    if (currentGazeDirection !== gazeDirection) {
        gazeStartTime = new Date().getTime();
        gazeDirection = currentGazeDirection;
    } else {
        const currentTime = new Date().getTime();
        if (currentTime - gazeStartTime >= GAZE_DURATION_THRESHOLD) {
            const midpoint = Math.floor(currentKeys.length / 2);
            if (gazeDirection === 'left') {
                currentKeys = currentKeys.slice(0, midpoint);
            } else {
                currentKeys = currentKeys.slice(midpoint);
            }

            if (currentKeys.length === 1) {
                selectedKeys += currentKeys[0];
                updateSelectedKeys();
                resetKeyboard();
                highlightZone(null); // Reset highlight
            } else {
                updateKeyboard();
            }

            gazeStartTime = null;
            gazeDirection = null;
        }
    }
}).begin();

// Initial render
updateKeyboard();
updateSelectedKeys();
highlightZone(null); // Initialize with default colors