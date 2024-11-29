(() => {
  const video = document.getElementById("video360");
  const timeLine = document.querySelector(".video-time-line");
  const iconSlide1 = document.querySelector(".iconslide1");
  const iconSlide2 = document.querySelector(".iconslide2");
  const iconSlide3 = document.querySelector(".iconslide3");
  const iconSlide4 = document.querySelector(".iconslide4");
  const iconSlide5 = document.querySelector(".iconslide5");

  let startX = 0;
  let startTime = 0;
  let isMouseDown = false;

  function setVideoSpeedReduce() {
    video.playbackRate = 0.7;
  }

  setVideoSpeedReduce();

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "00")}`;
  }

  function updateTimeDisplay() {
    const currentTime = formatTime(video.currentTime * 1000);
    timeLine.textContent = `${currentTime}`;
  }

  video.addEventListener("loadedmetadata", () => {
    updateTimeDisplay();
  });

  video.addEventListener("timeupdate", () => {
    updateTimeDisplay();
  });

  if (video.readyState >= 1) {
    updateTimeDisplay();
  } else {
    video.addEventListener("loadedmetadata", updateTimeDisplay);
  }

  video.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isMouseDown = true;
    startX = e.clientX;
    startTime = video.currentTime;
    video.pause();
  });

  video.addEventListener("mousemove", (e) => {
    e.preventDefault();
    if (!isMouseDown) return;
    //deltaX property  returns a positive value when scrolling to the right, and a negative value when scrolling to the left
    const deltaX = e.clientX - startX;
    // Adjust the video time based on mouse movement 1 pixel = 150ms change
    const newTime = startTime + deltaX / 150;

    if (newTime < 0) {
      video.currentTime = video.duration + (newTime % video.duration); // Wrap backward
    } else if (newTime > video.duration) {
      video.currentTime = newTime % video.duration; // Wrap forward
    } else {
      video.currentTime = newTime; // Within bounds
    }

    updateTimeDisplay();
  });

  video.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  video.addEventListener("mouseleave", () => {
    isMouseDown = false;
  });

  video.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
      video.currentTime -= 0.3;
      if (video.currentTime <= 0) {
        video.currentTime = video.duration;
        video.playbackRate = -0.6; // Reverse playback
        video.play();
      }
    } else {
      video.currentTime += 0.3;
      if (video.playbackRate < 0) {
        video.playbackRate = 0.6;
        video.play();
      }
    }

    if (video.currentTime < 0) video.currentTime = 0;
    if (video.currentTime > video.duration) video.currentTime = video.duration;

    updateTimeDisplay();

    e.preventDefault();
  });

  video.addEventListener("ended", () => {
    video.currentTime = 0;
  });

  video.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isMouseDown = true;
    startX = e.touches[0].clientX;
    startTime = video.currentTime;
    video.pause();
  });

  video.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isMouseDown) return;
    const deltaX = e.touches[0].clientX - startX;
    const newTime = startTime + deltaX / 110;
    if (newTime < 0) {
      video.currentTime = video.duration + (newTime % video.duration);
    } else if (newTime > video.duration) {
      video.currentTime = newTime % video.duration;
    } else {
      video.currentTime = newTime;
    }
    updateTimeDisplay();
  });

  video.addEventListener("touchend", () => {
    isMouseDown = false;
  });

  video.addEventListener("touchcancel", () => {
    isMouseDown = false;
  });

  iconSlide1.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = 20;
    updateTimeDisplay();
  });

  iconSlide2.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = 58.4;
    updateTimeDisplay();
  });

  iconSlide3.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = 29;
    updateTimeDisplay();
  });

  iconSlide4.addEventListener("click", (e) => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  iconSlide5.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = 40.7;
    updateTimeDisplay();
  });

  const overlayText = document.createElement("div");
  overlayText.className = "video-overlay-text";
  overlayText.textContent = "Swipe or drag to explore the 360 video";

  const videoContainer = document.querySelector(".video-player");
  videoContainer.appendChild(overlayText);

  video.addEventListener("click", function () {
    overlayText.classList.add("hidden");
  });
  video.addEventListener("touchstart", function () {
    overlayText.classList.add("hidden");
  });

  [iconSlide1, iconSlide2, iconSlide3, iconSlide4, iconSlide5].forEach(
    (icon) => {
      icon.addEventListener("click", () => {
        overlayText.classList.add("hidden");
      });
      icon.addEventListener("touchstart", () => {
        overlayText.classList.add("hidden");
      });
    }
  );
})();
