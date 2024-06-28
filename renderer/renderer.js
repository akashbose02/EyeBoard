let currentKeys = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
  'Shift', 'Ctrl', 'Space', 'Enter'
];

let gazeStartTime = null;
let gazeDirection = null;
const GAZE_DURATION_THRESHOLD = 2000; // 2 seconds

// Function to render the keyboard
function renderKeyboard(keys) {
  const keyboard = document.getElementById('keyboard');
  keyboard.innerHTML = ''; // Clear the keyboard

  keys.forEach(key => {
      const keyElement = document.createElement('div');
      keyElement.className = 'key';
      if (key === 'Shift' || key === 'Ctrl' || key === 'Enter') {
          keyElement.classList.add('double');
      }
      if (key === 'Space') {
          keyElement.classList.add('space');
      }
      keyElement.innerText = key;
      keyElement.onclick = () => {
          console.log(`Key pressed: ${key}`);
      };
      keyboard.appendChild(keyElement);
  });
}

// Initialize WebGazer
webgazer.setGazeListener((data, elapsedTime) => {
  if (data == null) {
      console.log("No gaze data available");
      return;
  }
  const x = data.x; // gaze x coordinate
  const y = data.y; // gaze y coordinate

  const keyboard = document.getElementById('keyboard');
  const rect = keyboard.getBoundingClientRect();

  const midX = rect.left + rect.width / 2; // midpoint of the keyboard

  const keyElements = document.getElementsByClassName('key');
  let currentGazeDirection = null;

  for (let key of keyElements) {
      const keyRect = key.getBoundingClientRect();
      if (x >= rect.left && x <= midX) {
          currentGazeDirection = 'left';
      } else if (x > midX && x <= rect.right) {
          currentGazeDirection = 'right';
      }
  }

  // Reset the highlight of keys
  for (let key of keyElements) {
      key.style.backgroundColor = 'lightgray';
  }

  // Highlight the correct half of the keyboard
  if (currentGazeDirection === 'left') {
      for (let key of keyElements) {
          const keyRect = key.getBoundingClientRect();
          if (keyRect.left < midX) {
              key.style.backgroundColor = 'yellow';
          }
      }
  } else if (currentGazeDirection === 'right') {
      for (let key of keyElements) {
          const keyRect = key.getBoundingClientRect();
          if (keyRect.left >= midX) {
              key.style.backgroundColor = 'yellow';
          }
      }
  }

  // Handle gaze direction and timing
  if (currentGazeDirection !== gazeDirection) {
      gazeStartTime = new Date().getTime();
      gazeDirection = currentGazeDirection;
  } else {
      const currentTime = new Date().getTime();
      if (currentTime - gazeStartTime >= GAZE_DURATION_THRESHOLD) {
          // Update the keyboard based on gaze
          if (gazeDirection === 'left') {
              currentKeys = currentKeys.slice(0, Math.ceil(currentKeys.length / 2));
          } else if (gazeDirection === 'right') {
              currentKeys = currentKeys.slice(Math.floor(currentKeys.length / 2));
          }
          renderKeyboard(currentKeys);

          if (currentKeys.length === 1) {
              console.log(`Final key selected: ${currentKeys[0]}`);
              // Perform any action with the final key
          }
          
          // Reset timing and direction
          gazeStartTime = null;
          gazeDirection = null;
      }
  }

}).begin().then(() => {
  console.log("WebGazer started successfully");
}).catch(err => {
  console.error("Error starting WebGazer:", err);
});

// Initial render
renderKeyboard(currentKeys);
