(function () {
  function readConfig(block) {
    const node = block.querySelector(".player-config");
    if (!node) {
      return null;
    }
    try {
      return JSON.parse(node.textContent || "{}");
    } catch (error) {
      return null;
    }
  }

  function prepareVideo(video, stream) {
    if (!video || !stream || video.getAttribute("data-ready") === "true") {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        maxBufferLength: 24,
        backBufferLength: 18,
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = stream;
    }

    video.setAttribute("data-ready", "true");
  }

  function initPlayer(block) {
    const video = block.querySelector(".player-video");
    const cover = block.querySelector(".player-cover");
    const config = readConfig(block);

    if (!video || !cover || !config || !config.stream) {
      return;
    }

    if (config.poster) {
      video.poster = config.poster;
    }

    function start() {
      prepareVideo(video, config.stream);
      cover.classList.add("is-hidden");
      video.controls = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    video.addEventListener("ended", function () {
      cover.classList.remove("is-hidden");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".js-player").forEach(initPlayer);
  });
})();
