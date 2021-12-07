
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volumeRange");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
console.log("video click")
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted || value != 0) {
        video.muted = false;
        muteBtn.innerText = "Mute";
        muteBtn.disabled = false;
    }
    if (value == 0){
        video.mute = true;
        muteBtn.innerText = "Unmute";
        muteBtn.disabled = true;
    }
    volumeValue = value;
    video.volume = value;
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);