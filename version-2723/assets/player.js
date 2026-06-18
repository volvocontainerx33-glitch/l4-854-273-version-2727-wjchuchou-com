(function () {
  window.initMoviePlayer = function (streamUrl, videoId, overlayId) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hls = null;
    var loaded = false;

    if (!video || !overlay) {
      return;
    }

    var attach = function () {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    };

    var play = function () {
      attach();
      overlay.classList.add('is-hidden');
      var request = video.play();

      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    };

    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
