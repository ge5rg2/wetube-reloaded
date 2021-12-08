
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volumeRange");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-up" : "fas fa-volume-mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted || value != 0) {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-mute";
        muteBtnIcon.disabled = false;
    }
    if (value == 0){
        video.mute = true;
        muteBtnIcon.classList = "fas fa-volume-up";
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(14, 5);
    // new date()는 1970.01.01...으로 시작한다 toISOString는 이것을 스트링화 시키고, substrs은 (ㄱ,ㄴ) ㄱ: 앞에서부터 자르는 숫자 ㄴ: 뒤에서부터 자르는 숫자

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    //타임라인의 value를 실시간 비디오 시간에 맞춘다
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
    //현재 전체화면인지 알 수 있게해주는 함수 true false로 나뉨
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
};

const autoScreenChange = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenBtnIcon.classList = "fas fa-compress";
  } else {
    fullScreenBtnIcon.classList = "fas fa-expand";
  }
}
// 전체화면 전환시 아이콘 변경 

const playKey = (e) => {
    if(e.which === 32) {
        handlePlayClick();
    } else if(e.which === 70) {
      handleFullscreen();
    } else if(e.which === 77) {
      handleMuteClick(e);
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(() => {
    videoControls.classList.remove("showing");
  }, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
// eventlistener에서 input 이벤트로 range조절
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
// 재생 시간관련 이벤트들
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
window.addEventListener("keydown", playKey);
//키보드 이벤트
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("fullscreenchange", autoScreenChange);