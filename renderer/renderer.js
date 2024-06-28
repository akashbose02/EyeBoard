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
  for (let key of keyElements) {
      const keyRect = key.getBoundingClientRect();
      if ((x >= rect.left && x <= midX && keyRect.left < midX) || 
          (x > midX && x <= rect.right && keyRect.left >= midX)) {
          key.style.backgroundColor = 'yellow'; // Highlight key
      } else {
          key.style.backgroundColor = 'lightgray'; // Reset key background
      }
  }
}).begin().then(() => {
  console.log("WebGazer started successfully");
}).catch(err => {
  console.error("Error starting WebGazer:", err);
});

// Create virtual keyboard
const keys = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/',
  'Shift', 'Ctrl', 'Space', 'Enter'
];

const keyboard = document.getElementById('keyboard');
keys.forEach(key => {
  const keyElement = document.createElement('div');
  keyElement.className = 'key';
  keyElement.innerText = key;
  keyElement.onclick = () => {
      console.log(`Key pressed: ${key}`);
  };
  keyboard.appendChild(keyElement);
});
