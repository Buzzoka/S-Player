// Spotify API credentials
const CLIENT_ID = 'e0474666db6b4b43842c63a503e62a85';
const CLIENT_SECRET = '5379f44c1a3f4eeea47497294a6a62c3';
const REDIRECT_URI = 'https://buzzoka.github.io/S-Player/';
const SCOPES = 'user-read-currently-playing';

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

// Animation duration for visualizer
const VISUALIZER_ANIMATION_DURATION = 150; // Duration in milliseconds

// Variable to store the previous song title and artist
let previousSongTitle = '';
let previousArtistName = '';

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
  document.querySelector('.bar-top').style.width = `${cappedProgress}%`;
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
        updateProgressBar(currentTime, duration)

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