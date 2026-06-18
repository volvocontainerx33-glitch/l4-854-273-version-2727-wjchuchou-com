(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", nav.classList.contains("is-open"));
    });
  }

  function setupHero() {
    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      if (slides.length < 2) {
        return;
      }

      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      start();
    });
  }

  function setupFilters() {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    document.querySelectorAll("[data-filter-form]").forEach(function (form) {
      var scope = form.parentElement || document;
      var input = form.querySelector("[data-filter-input]");
      var region = form.querySelector("[data-filter-region]");
      var type = form.querySelector("[data-filter-type]");
      var year = form.querySelector("[data-filter-year]");
      var category = form.querySelector("[data-filter-category]");
      var counter = form.querySelector("[data-filter-count]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function valueOf(element) {
        return element ? element.value.trim() : "";
      }

      function apply() {
        var query = valueOf(input).toLowerCase();
        var regionValue = valueOf(region);
        var typeValue = valueOf(type);
        var yearValue = valueOf(year);
        var categoryValue = valueOf(category);
        var count = 0;

        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (regionValue && card.getAttribute("data-region") !== regionValue) {
            matched = false;
          }
          if (typeValue && card.getAttribute("data-type") !== typeValue) {
            matched = false;
          }
          if (yearValue && card.getAttribute("data-year") !== yearValue) {
            matched = false;
          }
          if (categoryValue && card.getAttribute("data-category") !== categoryValue) {
            matched = false;
          }
          card.hidden = !matched;
          if (matched) {
            count += 1;
          }
        });

        if (counter) {
          counter.textContent = String(count);
        }
      }

      [input, region, type, year, category].forEach(function (element) {
        if (!element) {
          return;
        }
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      });

      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
