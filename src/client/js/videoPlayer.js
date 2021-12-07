
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volumeRange");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");

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

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(14, 5);
    // new date()는 1970.01.01...으로 시작한다 toISOString는 이것을 스트링화 시키고, substrs은 (ㄱ,ㄴ) ㄱ: 앞에서부터 자르는 숫자 ㄴ: 뒤에서부터 자르는 숫자

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
// eventlistener에서 input 이벤트로 range조절
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
// 재생 시간관련 이벤트들