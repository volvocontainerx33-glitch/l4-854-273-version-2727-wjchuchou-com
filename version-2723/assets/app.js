(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    var show = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    var restart = function () {
      window.clearInterval(timer);
      start();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    show(0);
    start();
  }

  var cardSearch = document.querySelector('[data-card-search]');
  var cardFilter = document.querySelector('[data-card-filter="type"]');
  var cardList = document.querySelector('[data-card-list]');

  if (cardList && (cardSearch || cardFilter)) {
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));
    var filterCards = function () {
      var keyword = cardSearch ? cardSearch.value.trim().toLowerCase() : '';
      var type = cardFilter ? cardFilter.value : '';

      cards.forEach(function (card) {
        var title = card.getAttribute('data-title') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matchedKeyword = !keyword || title.indexOf(keyword) !== -1;
        var matchedType = !type || cardType === type;
        card.classList.toggle('is-hidden-card', !(matchedKeyword && matchedType));
      });
    };

    if (cardSearch) {
      cardSearch.addEventListener('input', filterCards);
    }

    if (cardFilter) {
      cardFilter.addEventListener('change', filterCards);
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchStatus = document.querySelector('[data-search-status]');

  if (searchInput && searchResults && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    var makeCard = function (item) {
      var tags = (item.tags || []).slice(0, 2).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return '' +
        '<article class="movie-card">' +
          '<a class="movie-card__cover" href="' + item.url + '">' +
            '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
            '<span class="movie-card__region">' + escapeHtml(item.region) + '</span>' +
            '<span class="movie-card__type">' + escapeHtml(item.type) + '</span>' +
          '</a>' +
          '<div class="movie-card__body">' +
            '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>' +
            '<p>' + escapeHtml(item.oneLine) + '</p>' +
            '<div class="movie-card__meta"><div class="tags">' + tags + '</div><span>' + escapeHtml(item.year) + '</span></div>' +
          '</div>' +
        '</article>';
    };

    var runSearch = function () {
      var query = searchInput.value.trim().toLowerCase();
      var matched = window.SEARCH_INDEX.filter(function (item) {
        if (!query) {
          return true;
        }

        var text = [
          item.title,
          item.year,
          item.region,
          item.type,
          item.oneLine,
          (item.genres || []).join(' '),
          (item.tags || []).join(' ')
        ].join(' ').toLowerCase();

        return text.indexOf(query) !== -1;
      }).slice(0, 80);

      searchResults.innerHTML = matched.map(makeCard).join('');

      if (searchStatus) {
        searchStatus.textContent = query ? '搜索结果' : '推荐浏览';
      }
    };

    searchInput.addEventListener('input', runSearch);
    runSearch();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }
})();
