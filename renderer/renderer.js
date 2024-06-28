const letters = '01234ABCDEFGHIJKLM56789NOPQRSTUVWXYZ␣'.split('');
let currentKeys = letters;
let selectedKeys = '';

let gazeStartTime = null;
let gazeDirection = null;
const GAZE_DURATION_THRESHOLD = 2000;

function updateKeyboard() {
    const leftZone = document.querySelector('.left-zone');
    const rightZone = document.querySelector('.right-zone');
    const midpoint = Math.floor(currentKeys.length / 2);

    leftZone.textContent = currentKeys.slice(0, midpoint).join(' ');
    rightZone.textContent = currentKeys.slice(midpoint).join(' ');
}

function updateSelectedKeys() {
    const inputElement = document.getElementById('text-input');
    inputElement.value = selectedKeys;

    // Speak the last letter typed
    const lastChar = selectedKeys[selectedKeys.length - 1];
    if (lastChar !== undefined) {
        speakText(lastChar === '␣' ? 'space' : lastChar);
    }
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

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

webgazer.setGazeListener((data, elapsedTime) => {
    if (data == null) return;

    const x = data.x;
    const keyboard = document.getElementById('keyboard');
    const rect = keyboard.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    let currentGazeDirection = x < midX ? 'left' : 'right';

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
                highlightZone(null); 
            } else {
                updateKeyboard();
            }

            gazeStartTime = null;
            gazeDirection = null;
        }
    }
}).begin();

updateKeyboard();
updateSelectedKeys();
highlightZone(null);
