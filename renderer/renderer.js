// Initialize WebGazer
webgazer.setGazeListener((data, elapsedTime) => {
    if (data == null) {
      console.log("No gaze data available");
      return;
    }
    const x = data.x; // gaze x coordinate
    const y = data.y; // gaze y coordinate
  
    const keyElements = document.getElementsByClassName('key');
    for (let key of keyElements) {
      const rect = key.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
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
    '1', '2', 
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
  