(function () {
  var heroTimer = null;

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector(".menu-toggle");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      var open = !document.body.classList.contains("is-menu-open");
      document.body.classList.toggle("is-menu-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    function schedule() {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        schedule();
      });
    });
    show(0);
    schedule();
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var search = scope.querySelector(".js-search");
      var year = scope.querySelector(".js-year");
      var type = scope.querySelector(".js-type");
      var items = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-row"));
      var empty = scope.querySelector(".js-empty");
      function apply() {
        var query = normalize(search && search.value);
        var selectedYear = normalize(year && year.value);
        var selectedType = normalize(type && type.value);
        var visible = 0;
        items.forEach(function (item) {
          var text = normalize(item.getAttribute("data-text") || item.textContent);
          var itemYear = normalize(item.getAttribute("data-year"));
          var itemType = normalize(item.getAttribute("data-type"));
          var match = true;
          if (query && text.indexOf(query) === -1) {
            match = false;
          }
          if (selectedYear && itemYear !== selectedYear) {
            match = false;
          }
          if (selectedType && itemType !== selectedType) {
            match = false;
          }
          item.hidden = !match;
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }
      [search, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function applyQueryFromUrl() {
    ready(function () {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (!query) {
        return;
      }
      var input = document.querySelector(".js-search");
      if (input) {
        input.value = query;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  function mountPlayer(source) {
    ready(function () {
      var video = document.querySelector(".movie-video");
      var cover = document.querySelector(".player-cover");
      if (!video || !source) {
        return;
      }
      var attached = false;
      var hlsInstance = null;
      function attach() {
        if (attached) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              showPlayerMessage("视频加载失败，请稍后重试");
            }
          });
        } else {
          showPlayerMessage("您的浏览器暂不支持该视频格式");
        }
      }
      function showPlayerMessage(message) {
        if (!cover) {
          return;
        }
        cover.innerHTML = '<span class="play-symbol">' + message + '</span>';
        cover.classList.remove("is-hidden");
      }
      function start() {
        attach();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            if (cover) {
              cover.classList.remove("is-hidden");
            }
          });
        }
      }
      if (cover) {
        cover.addEventListener("click", start);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });

  window.MovieSite = {
    mountPlayer: mountPlayer,
    applyQueryFromUrl: applyQueryFromUrl
  };
})();
