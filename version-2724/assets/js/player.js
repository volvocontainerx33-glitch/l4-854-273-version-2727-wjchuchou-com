import { H as Hls } from "./hls.js";

function attachStream(video, source) {
  if (!video || !source) {
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    return;
  }

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    video.hlsInstance = hls;
    return;
  }

  video.src = source;
}

export function initMoviePlayer(source) {
  const player = document.querySelector(".movie-player");
  const video = player ? player.querySelector("video") : null;
  const cover = player ? player.querySelector(".player-cover") : null;
  let ready = false;

  if (!player || !video) {
    return;
  }

  function start() {
    if (!ready) {
      attachStream(video, source);
      ready = true;
    }

    player.classList.add("is-playing");
    const request = video.play();
    if (request && typeof request.catch === "function") {
      request.catch(() => {});
    }
  }

  if (cover) {
    cover.addEventListener("click", start);
  }

  video.addEventListener("click", () => {
    if (!ready) {
      start();
    }
  });

  video.addEventListener("play", () => {
    player.classList.add("is-playing");
  });
}
