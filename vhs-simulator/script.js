const videoElement = document.getElementById('vhs-video');
const videos = ['vhs.mp4', 'vid1.mp4', 'vid2.mp4', 'vid3.mp4']; // Video sequence for autoplay
let currentVideoIndex = 0;

// Function to load and play a specific video
function playVideo(videoSrc, loop = false, playbackRate = 1) {
    videoElement.src = videoSrc;
    videoElement.loop = loop; // Set looping as needed
    videoElement.playbackRate = playbackRate; // Set playback speed
    videoElement.play();
}

// Event listener for the 'Play' button
document.getElementById('play-btn').addEventListener('click', () => {
    currentVideoIndex = 0; // Reset to the first video
    playVideo(videos[currentVideoIndex]);
    videoElement.onended = () => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length; // Move to next video
        playVideo(videos[currentVideoIndex]);
    };
});

// Event listener for the 'Pause' button
document.getElementById('pause-btn').addEventListener('click', () => {
    videoElement.onended = null; // Stop autoplay sequence
    playVideo('pause.mp4', true); // Play pause.mp4 in loop
});

// Event listener for the 'Rewind' button
document.getElementById('rewind-btn').addEventListener('click', () => {
    videoElement.onended = null; // Stop autoplay sequence
    playVideo('rewind.mp4', false, -2); // Simulate rewind with negative playback rate
});

// Event listener for the 'Fast Forward' button
document.getElementById('fast-forward-btn').addEventListener('click', () => {
    videoElement.onended = null; // Stop autoplay sequence
    playVideo('fast-forward.mp4', false, 2); // Simulate fast-forward with double playback rate
});

// Event listener for the 'Eject' button
document.getElementById('eject-btn').addEventListener('click', () => {
    videoElement.onended = null; // Stop autoplay sequence
    playVideo('eject.mp4', true); // Play eject.mp4 in loop
    setTimeout(() => {
        videoElement.pause();
        videoElement.currentTime = 0; // Reset video after eject animation
    }, 3000); // Delay for eject animation
});

// Glitch Style Selector
const glitchStyleDropdown = document.getElementById('glitch-style');
glitchStyleDropdown.addEventListener('change', (e) => {
    const style = e.target.value;
    const glitches = document.querySelector('.vhs-glitches');
    glitches.className = `vhs-glitches ${style}`; // Apply selected glitch style
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') videoElement.paused ? videoElement.play() : videoElement.pause(); // Toggle play/pause
    if (e.key === 'ArrowLeft') videoElement.currentTime -= 5; // Skip backward
    if (e.key === 'ArrowRight') videoElement.currentTime += 5; // Skip forward
});

// Error Handling
videoElement.addEventListener('error', () => {
    alert('Error loading video. Please try again.');
});
