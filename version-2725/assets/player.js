(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var shell = document.querySelector("[data-player]");
    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".play-overlay");
    var source = video ? video.querySelector("source") : null;
    var src = source ? source.getAttribute("src") : "";
    var prepared = false;
    var hlsInstance = null;

    function prepareVideo() {
      if (prepared || !video || !src) {
        return;
      }

      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
        video.src = src;
      } else {
        video.src = src;
      }
    }

    function playSelectedVideo() {
      prepareVideo();
      if (!video) {
        return;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playSelectedVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playSelectedVideo();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("pause", function () {
        if (overlay && video.currentTime < 0.1) {
          overlay.classList.remove("is-hidden");
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance && typeof hlsInstance.destroy === "function") {
        hlsInstance.destroy();
      }
    });
  });
})();
