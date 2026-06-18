(function () {
  var MovieSite = window.MovieSite || {};

  function each(selector, callback, root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(selector), callback);
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupLocalFilter() {
    var input = document.querySelector('[data-local-filter]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    if (!cards.length || (!input && !yearSelect)) {
      return;
    }

    function matchesYear(card, selected) {
      if (!selected) {
        return true;
      }
      var year = card.getAttribute('data-year') || '';
      if (selected === 'older') {
        return Number(year) < 2020;
      }
      return year === selected;
    }

    function update() {
      var query = normalize(input ? input.value : '');
      var year = yearSelect ? yearSelect.value : '';
      cards.forEach(function (card) {
        var blob = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' '));
        var visible = (!query || blob.indexOf(query) !== -1) && matchesYear(card, year);
        card.classList.toggle('is-hidden', !visible);
      });
    }

    if (input) {
      input.addEventListener('input', update);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', update);
    }
  }

  function setupSearch() {
    var modal = document.querySelector('[data-search-modal]');
    var input = document.querySelector('[data-global-search]');
    var results = document.querySelector('[data-search-results]');
    if (!modal || !input || !results) {
      return;
    }
    var data = window.siteSearchData || [];

    function open() {
      modal.hidden = false;
      window.setTimeout(function () {
        input.focus();
      }, 30);
    }

    function close() {
      modal.hidden = true;
      input.value = '';
      results.innerHTML = '';
    }

    function resultTemplate(item) {
      return '<a class="search-result" href="' + item.url + '">' +
        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
        '<span><h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.region + ' · ' + item.year + ' · ' + item.category) + '</p></span>' +
        '</a>';
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function render() {
      var query = normalize(input.value);
      if (!query) {
        results.innerHTML = '';
        return;
      }
      var matched = data.filter(function (item) {
        return normalize(item.title + ' ' + item.region + ' ' + item.year + ' ' + item.category + ' ' + item.tags).indexOf(query) !== -1;
      }).slice(0, 24);
      if (!matched.length) {
        results.innerHTML = '<p class="empty-result">没有找到匹配内容</p>';
        return;
      }
      results.innerHTML = matched.map(resultTemplate).join('');
    }

    each('[data-search-open]', function (button) {
      button.addEventListener('click', open);
    });
    each('[data-search-close]', function (button) {
      button.addEventListener('click', close);
    });
    input.addEventListener('input', render);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        close();
      }
    });
  }

  MovieSite.setupPlayer = function (streamUrl) {
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    var actions = Array.prototype.slice.call(document.querySelectorAll('[data-player-action]'));
    var ready = false;

    if (!video || !cover || !streamUrl) {
      return;
    }

    function attach() {
      if (ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsPlayer = hls;
      } else {
        video.src = streamUrl;
      }
      ready = true;
    }

    function play() {
      attach();
      cover.classList.add('is-hidden');
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    actions.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        play();
      });
    });
    cover.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupLocalFilter();
    setupSearch();
  });

  window.MovieSite = MovieSite;
})();
