function initMoviePlayer(source) {
  var video = document.getElementById('moviePlayer');
  var button = document.querySelector('[data-play-button]');
  var shell = document.querySelector('[data-player-shell]');
  var attached = false;
  var hlsInstance = null;

  function attachSource() {
    if (!video || attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function playMovie() {
    if (!video) {
      return;
    }
    attachSource();
    if (button) {
      button.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', playMovie);
  }

  if (shell) {
    shell.addEventListener('click', function (event) {
      if (event.target === shell) {
        playMovie();
      }
    });
  }

  if (video) {
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
    video.addEventListener('error', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
    video.addEventListener('loadedmetadata', function () {
      if (hlsInstance && video.paused && button) {
        button.classList.remove('is-hidden');
      }
    });
  }
}
