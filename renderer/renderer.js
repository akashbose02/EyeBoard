const letters = "01234ABCDEFGHIJKLM56789NOPQRSTUVWXYZ␣".split("");
let sen_length = 0;
let currentKeys = letters;
let selectedKeys = "";

let gazeStartTime = null;
let gazeDirection = null;
const GAZE_DURATION_THRESHOLD = 1500;

function speak(sentence) {
  const utterance = new SpeechSynthesisUtterance(sentence);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[0];
  speechSynthesis.speak(utterance);
}

function updateKeyboard() {
  const leftZone = document.querySelector(".left-zone");
  const rightZone = document.querySelector(".right-zone");
  const midpoint = Math.floor(currentKeys.length / 2);

  leftZone.textContent = currentKeys.slice(0, midpoint).join(" ");
  rightZone.textContent = currentKeys.slice(midpoint).join(" ");
}

function updateSelectedKeys() {
  const inputElement = document.getElementById("text-input");
  inputElement.value = selectedKeys;

  const lastChar = selectedKeys[selectedKeys.length - 1];
  if (lastChar !== undefined) {
    speak(lastChar === "␣" ? "space" : lastChar);
  }

  const words = selectedKeys.trim().split(" ");
  if (selectedKeys.endsWith(" ") && words.length > 0) {
    speak(words[words.length - 2]);
  }
}

function resetKeyboard() {
  currentKeys = letters;
  updateKeyboard();
}

function highlightZone(direction) {
  const leftZone = document.querySelector(".left-zone");
  const rightZone = document.querySelector(".right-zone");

  if (direction === "left") {
    leftZone.style.backgroundColor = "yellow";
    rightZone.style.backgroundColor = "lightgreen";
  } else if (direction === "right") {
    leftZone.style.backgroundColor = "lightblue";
    rightZone.style.backgroundColor = "yellow";
  } else {
    leftZone.style.backgroundColor = "lightblue";
    rightZone.style.backgroundColor = "lightgreen";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const bufferingElement = document.getElementById("buffering");

  webgazer
    .setGazeListener((data, elapsedTime) => {
      if (data == null) return;

      const x = data.x;
      const keyboard = document.getElementById("keyboard");
      const rect = keyboard.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;

      let currentGazeDirection = x < midX ? "left" : "right";

      highlightZone(currentGazeDirection);

      if (bufferingElement.style.display !== "none") {
        bufferingElement.style.display = "none";
      }

      if (currentGazeDirection !== gazeDirection) {
        gazeStartTime = new Date().getTime();
        gazeDirection = currentGazeDirection;
      } else {
        const currentTime = new Date().getTime();
        if (currentTime - gazeStartTime >= GAZE_DURATION_THRESHOLD) {
          const midpoint = Math.floor(currentKeys.length / 2);
          if (gazeDirection === "left") {
            currentKeys = currentKeys.slice(0, midpoint);
          } else {
            currentKeys = currentKeys.slice(midpoint);
          }

          if (currentKeys.length === 1) {
            if(currentKeys[0] === '␣')
                selectedKeys += ' '
            else
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
    })
    .begin();

  updateKeyboard();
  updateSelectedKeys();
  highlightZone(null);
});
