// FUNCTION to toggle between the play and pause and at the end it saves to local storage
function playPause(){
  iconName = document.getElementById("playPause");
  toggleButton = document.getElementById("toggleButton");

  if (toggleButton.className === 'play-pause play'){
    toggleButton.className = 'play-pause pause'
  }
  else {
    toggleButton.className = 'play-pause play'
  }
  
  if (iconName.className === 'bx bx-pause'){
    iconName.className = 'bx bx-play'
  }
  else {
    iconName.className = 'bx bx-pause'
  }

  localStorage.setItem('iconName', iconName.className);
  localStorage.setItem('toggleButton', toggleButton.className);
}

// FUNCTION to save the info of the controls to the localStorage
function saveControlsInfo () {
  const storedIconName = localStorage.getItem('iconName');
  const storedToggleButton = localStorage.getItem('toggleButton');

  if (storedIconName) {
    document.getElementById("playPause").className = storedIconName;
  }

  if (storedToggleButton) {
    document.getElementById("toggleButton").className = storedToggleButton;
  }
}

// Get the information on page load
saveControlsInfo()