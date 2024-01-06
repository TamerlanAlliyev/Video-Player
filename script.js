'use strict';

const videoList = ["space","interstellar", "life-beyond","earth's-sky","earth"];

const mainVideo = document.querySelector("video");
const container = document.querySelector(".container")
const videoTimeline = document.querySelector(".video-timeline");

// Video duration controls
const playPauseBtn = document.querySelector(".play-pause");
const playPauseBtnIcon = document.querySelector(".play-pause img");
const skipForwardBtn = document.querySelector(".skip-forward");
const skipBackwardBtn = document.querySelector(".skip-backward");
const currentVidTime = document.querySelector(".current-time");
const videoDuration = document.querySelector(".video-duration");
const progressBar = document.querySelector(".progress-bar");

// Video Volume
const volumeIcon = document.querySelector(".volume img");
const volumeLine = document.querySelector(".volume-line");
const volumeBar = document.querySelector(".volume-bar");

// Second skip
const secoundForwardBtn = document.querySelector(".secound-forward");
const secoundBackBtn = document.querySelector(".secound-back");

// Screen mode
const fullscreenBtn = document.querySelector('.fullscreen');
const picInPicBtn = document.querySelector('.pic-in-pic');

// Playback
const playbackSpeedBtn = document.querySelector(".playback-speed");
const speedOptions = document.querySelector(".speed-options");
const speedList = speedOptions.querySelectorAll(".speed-options li");






// Video duration controls
let playCount = 0;

let isVideoPlaying = false;

playPauseBtn.addEventListener("click", () => {
  if (isVideoPlaying) {
    mainVideo.pause();
    playPauseBtnIcon.src = `./assets/icons/play.svg`;
    isVideoPlaying = false;
  }
  else {
    mainVideo.play();
    playPauseBtnIcon.src = `./assets/icons/pause.svg`;
    isVideoPlaying = true;
  }
});

skipForwardBtn.addEventListener("click", () => {
  playCount = (playCount + 1) % videoList.length;
  playPauseBtnIcon.src = `./assets/icons/play.svg`;
  isVideoPlaying = false;
  changeVideo();
});

skipBackwardBtn.addEventListener("click", () => {
  playCount = (playCount - 1 + videoList.length) % videoList.length;
  playPauseBtnIcon.src = `./assets/icons/play.svg`;
  isVideoPlaying = false;
  changeVideo();
});

const changeVideo = () => {
  mainVideo.src = `./assets/video/${videoList[playCount]}.mp4`;
  if(isVideoPlaying) {
    mainVideo.play();
    playPauseBtnIcon.src = `./assets/icons/pause.svg`;
    isVideoPlaying = true;
  }
};

mainVideo.addEventListener('ended', () => {
  playPauseBtnIcon.src = './assets/icons/play.svg';
  isVideoPlaying = false;
});




// Video time
const formatTime = time => {
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

videoTimeline.addEventListener("mousemove", e => {
  const timelineWidth = videoTimeline.clientWidth;
  const offsetX = e.offsetX;
  const percent = (offsetX / timelineWidth) * mainVideo.duration;
  const progressTime = videoTimeline.querySelector("span");
  const formattedTime = formatTime(percent);

  progressTime.style.left = `${offsetX}px`;
  progressTime.innerText = formattedTime;
});

videoTimeline.addEventListener("click", e => {
  const timelineWidth = videoTimeline.clientWidth;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", () => {
  const currentTime = mainVideo.currentTime;
  const duration = mainVideo.duration;
  const percent = (currentTime / duration) * 100;

  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
  videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
  const timelineWidth = videoTimeline.clientWidth;
  progressBar.style.width = `${e.offsetX}px`;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});





// Video Volume
let isDragging = false;
volumeIcon.addEventListener("mouseenter", () => {
  volumeLine.classList.remove("hidden");
});

volumeLine.addEventListener("mouseleave", () => {
  if (!isDragging) {
    volumeLine.classList.add("hidden");
  }
});

volumeLine.addEventListener("mousedown", e => {
  isDragging = true;
  updateVolume(e);
});

volumeLine.addEventListener("mousemove", e => {
  if (isDragging) {
    updateVolume(e);
  }
});

volumeLine.addEventListener("mouseup", () => {
  isDragging = false;
});

function updateVolume(e) {
  const volumeLineRect = volumeLine.getBoundingClientRect();
  const percent = 1 - ((e.clientY - volumeLineRect.top) / volumeLineRect.height);
  volumeBar.style.height = `${percent * 100}%`;
  mainVideo.volume = percent;

  if (mainVideo.volume < 0.1) {
    volumeIcon.src = `./assets/icons/no_sound.svg`;
  } else if (mainVideo.volume >= 0.1 && mainVideo.volume < 0.5) {
    volumeIcon.src = `./assets/icons/volume_down.svg`;
  } else {
    volumeIcon.src = `./assets/icons/volume_up (1).svg`;
  }
}



volumeIcon.addEventListener('click', (e) => {
  if (mainVideo.volume > 0) {
    mainVideo.volume = 0;
    volumeIcon.src = `./assets/icons/no_sound.svg`;
  } else {
    mainVideo.volume = 0.5;
    volumeIcon.src = `./assets/icons/volume_up (1).svg`;
  }
});
















// Second skip
secoundForwardBtn.addEventListener("click", () => {
  mainVideo.currentTime += 10;
});

secoundBackBtn.addEventListener("click", () => {
  mainVideo.currentTime -= 10;
});










playbackSpeedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

speedList.forEach(option => {
  option.addEventListener("click", () => {
    const playbackRate = parseFloat(option.dataset.speed); 
    mainVideo.playbackRate = playbackRate;

    speedList.forEach(item => {
      item.classList.remove("active");
    });

    option.classList.add("active");

    speedOptions.classList.remove("show");
  });
});

document.addEventListener("click", e => {
  const isPlaybackSpeedBtn = e.target.closest(".playback-speed");
  if (!isPlaybackSpeedBtn) {
    speedOptions.classList.remove("show");
  }
});



// Screen mode
let screenMode = false;
fullscreenBtn.addEventListener('click', () => {
  if (!screenMode) {
    container.classList.add("fullscreen")
    screenMode = true;
    fullscreenBtn.innerHTML = '<img src="./assets/icons/fullscreen_exit.svg" alt="">'; 
  } else {
    container.classList.remove("fullscreen")
    screenMode = false;
    fullscreenBtn.innerHTML = '<img src="./assets/icons/fullscreen.svg" alt="">'; 
  }
});

picInPicBtn.addEventListener('click', () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    mainVideo.requestPictureInPicture();
  }
})
