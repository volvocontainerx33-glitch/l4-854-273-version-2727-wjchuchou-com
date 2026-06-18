import { H as Hls } from './hls-vendor-dru42stk.js';

export function setupPlayer(source, videoId, buttonId, coverId) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  const cover = document.getElementById(coverId);

  if (!video || !source) {
    return;
  }

  let ready = false;
  let hls = null;

  const prepare = () => {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  };

  const play = () => {
    prepare();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    const promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  };

  if (button) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', () => {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  video.addEventListener('ended', () => {
    if (cover) {
      cover.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
