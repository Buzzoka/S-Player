// Spotify API credentials
const CLIENT_ID = 'e0474666db6b4b43842c63a503e62a85';
const CLIENT_SECRET = '5379f44c1a3f4eeea47497294a6a62c3';
const REDIRECT_URI = 'https://buzzoka.github.io/S-Player/';
const SCOPES = 'user-read-currently-playing user-modify-playback-state';

// Construct the authorization URL with the scope
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}&response_type=code`;

// Authorization token endpoint
const AUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Spotify API base URL
const API_BASE_URL = 'https://api.spotify.com/v1';

// Access token variable
let accessToken = '';


// Function to retrieve access token
async function getAccessToken() {
  // Use the authorization code from the URL query parameter if available
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  // If authorization code is present, exchange it for an access token
  if (code) {
    try {
      const response = await fetch(AUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        accessToken = data.access_token;
        console.log('success')
        return accessToken;
      } else {
        console.error('Failed to retrieve access token:', response.status);
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
  }

  // If access token is not available, redirect user to authorization URL
  window.location.href = AUTH_URL;
}


// Function to update the progress bar
function updateProgressBar(currentTime, duration) {
  const progressPercentage = (currentTime / duration) * 100;
  const cappedProgress = Math.min(progressPercentage, 100);
  document.querySelector('.Progress-Top').style.width = `${cappedProgress}%`;
}

// Helper function to format time as MM:SS
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to fetch the currently playing song
async function fetchCurrentlyPlayingSong() {
  const currentlyPlayingUrl = `${API_BASE_URL}/me/player/currently-playing`;

  try {
    const response = await fetch(currentlyPlayingUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.item) {
        const songTitle = data.item.name;
        const artistName = data.item.artists[0].name;
        const songDuration = data.item.duration_ms; // Song duration in milliseconds
        const progressMs = data.progress_ms; // Current playback position in milliseconds

        // Update the widget with the currently playing song information
        document.getElementById('Info-Title').textContent = songTitle;
        document.getElementById('Info-Artist').textContent = artistName;
        document.getElementById('time-progress').textContent = formatTime(Math.floor(progressMs / 1000)); // Convert progress from milliseconds to seconds
        document.getElementById('time-duration').textContent = formatTime(Math.floor(songDuration / 1000)); // Convert duration from milliseconds to seconds

        // Update update the progress bar
        updateProgressBar(progressMs, songDuration);

        // Update the album picture
        const albumImage = data.item.album.images[0].url; // Assuming the first image in the array is the desired size
        document.getElementById('album-image').src = albumImage;
      }
    } else {
      console.error('Failed to fetch currently playing song');
    }
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
  }
}



// Function to play the next track
async function playNextTrack() {
  const nextTrackUrl = `${API_BASE_URL}/me/player/next`;

  try {
    const response = await fetch(nextTrackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to play the next track');
    }
  } catch (error) {
    console.error('Error playing the next track:', error);
  }
}

// Function to play the previous track
async function playPreviousTrack() {
  const previousTrackUrl = `${API_BASE_URL}/me/player/previous`;

  try {
    const response = await fetch(previousTrackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to play the previous track');
    }
  } catch (error) {
    console.error('Error playing the previous track:', error);
  }
}



// Function to toggle play/pause for the currently active track
async function togglePlayPause() {
  const playerStateUrl = `${API_BASE_URL}/me/player`;

  try {
    // Fetch the current player state to determine if it's playing or paused
    const response = await fetch(playerStateUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const isPlaying = data.is_playing;

      // If currently playing, pause the track; otherwise, play it
      const playPauseUrl = isPlaying
        ? `${API_BASE_URL}/me/player/pause`
        : `${API_BASE_URL}/me/player/play`;

      const playPauseResponse = await fetch(playPauseUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!playPauseResponse.ok) {
        console.error('Failed to toggle play/pause');
      }
    } else {
      console.error('Failed to fetch player state');
    }
  } catch (error) {
    console.error('Error toggling play/pause:', error);
  }
}



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




getAccessToken().then(() => {
  setInterval(() => {
     fetchCurrentlyPlayingSong().catch((error) => {
       console.error('Error fetching currently playing song:', error);
     });
   }, 1000);
});