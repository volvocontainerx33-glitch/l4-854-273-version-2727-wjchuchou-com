(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var tabs = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-tab]"));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        tabs.forEach(function (tab, tabIndex) {
          tab.classList.toggle("is-active", tabIndex === current);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          showSlide(index);
          startTimer();
        });
      });

      showSlide(0);
      startTimer();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var input = panel.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-chip]"));
      var section = panel.closest(".content-section") || document;
      var list = section.querySelector("[data-filter-list]") || document;
      var cards = Array.prototype.slice.call(list.querySelectorAll("[data-filter-card]"));
      var activeChip = "";

      function textOf(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type")
        ].join(" ").toLowerCase();
      }

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var chip = activeChip.toLowerCase();
        cards.forEach(function (card) {
          var haystack = textOf(card);
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedChip = !chip || haystack.indexOf(chip) !== -1;
          card.classList.toggle("is-hidden", !(matchedQuery && matchedChip));
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      chips.forEach(function (chipButton) {
        chipButton.addEventListener("click", function () {
          chips.forEach(function (button) {
            button.classList.remove("is-active");
          });
          chipButton.classList.add("is-active");
          activeChip = chipButton.getAttribute("data-filter-chip") || "";
          applyFilter();
        });
      });
    });
  });
})();
