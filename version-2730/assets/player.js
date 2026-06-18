(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function playVideo(player) {
    var video = player.querySelector("video");
    var status = player.querySelector("[data-player-status]");
    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    if (!stream) {
      if (status) {
        status.textContent = "暂时无法播放";
      }
      return;
    }

    function markPlaying() {
      player.classList.add("is-playing");
      if (status) {
        status.textContent = "";
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (status) {
            status.textContent = "点击播放器继续观看";
          }
        });
      }
    }

    if (video.dataset.ready === "1") {
      markPlaying();
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      video.dataset.ready = "1";
      markPlaying();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.dataset.ready = "1";
        markPlaying();
      });
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal && status) {
          status.textContent = "播放失败，请稍后再试";
        }
      });
      return;
    }

    video.src = stream;
    video.dataset.ready = "1";
    markPlaying();
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var button = player.querySelector(".player-start");
      if (button) {
        button.addEventListener("click", function () {
          playVideo(player);
        });
      }
    });
  });
})();
