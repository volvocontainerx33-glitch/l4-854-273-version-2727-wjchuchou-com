(function () {
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.getElementById("mobileNav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".hero-slider").forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll(".hero-dot"));
    const prev = slider.querySelector(".hero-prev");
    const next = slider.querySelector(".hero-next");
    let index = Math.max(
      0,
      slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      }),
    );
    let timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 6500);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    show(index);
    restart();
  });

  document.querySelectorAll(".js-filter-form").forEach(function (form) {
    const input = form.querySelector(".js-filter-input");
    const select = form.querySelector(".js-filter-select");
    const scope = form.parentElement || document;
    const cards = Array.from(scope.querySelectorAll(".js-movie-card"));

    function applyFilter() {
      const query = input ? input.value.trim().toLowerCase() : "";
      const genre = select ? select.value : "";
      cards.forEach(function (card) {
        const text = (card.getAttribute("data-search") || "").toLowerCase();
        const cardGenre = card.getAttribute("data-genre") || "";
        const matched =
          (!query || text.indexOf(query) !== -1) &&
          (!genre || cardGenre === genre);
        card.style.display = matched ? "" : "none";
      });
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }
    if (select) {
      select.addEventListener("change", applyFilter);
    }
  });
})();
