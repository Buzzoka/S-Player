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