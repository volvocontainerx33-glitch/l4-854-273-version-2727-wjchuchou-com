const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
let heroIndex = 0;
let heroTimer = null;

function showHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, current) => {
    slide.classList.toggle("is-active", current === heroIndex);
  });
  heroDots.forEach((dot, current) => {
    dot.classList.toggle("is-active", current === heroIndex);
  });
}

function startHeroTimer() {
  if (heroSlides.length < 2) {
    return;
  }

  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => {
    showHeroSlide(heroIndex + 1);
  }, 5600);
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHeroSlide(Number(dot.dataset.heroDot || 0));
    startHeroTimer();
  });
});

showHeroSlide(0);
startHeroTimer();

const panels = Array.from(document.querySelectorAll("[data-search-panel]"));

panels.forEach((panel) => {
  const scope = panel.parentElement || document;
  const input = panel.querySelector("[data-search-input]");
  const reset = panel.querySelector("[data-reset-search]");
  const year = panel.querySelector("[data-filter-year]");
  const type = panel.querySelector("[data-filter-type]");
  const category = panel.querySelector("[data-filter-category]");
  const empty = panel.querySelector("[data-empty-state]");
  const cards = Array.from(scope.querySelectorAll("[data-movie-card]"));

  const query = new URLSearchParams(window.location.search).get("q");
  if (query && input) {
    input.value = query;
  }

  function includesValue(source, value) {
    return !value || String(source || "").includes(value);
  }

  function runFilter() {
    const keyword = input ? input.value.trim().toLowerCase() : "";
    const yearValue = year ? year.value : "";
    const typeValue = type ? type.value : "";
    const categoryValue = category ? category.value : "";
    let visible = 0;

    cards.forEach((card) => {
      const text = String(card.dataset.search || "").toLowerCase();
      const okKeyword = !keyword || text.includes(keyword);
      const okYear = includesValue(card.dataset.year, yearValue);
      const okType = includesValue(card.dataset.type, typeValue);
      const okCategory = includesValue(card.dataset.category, categoryValue);
      const show = okKeyword && okYear && okType && okCategory;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  [input, year, type, category].forEach((control) => {
    if (control) {
      control.addEventListener("input", runFilter);
      control.addEventListener("change", runFilter);
    }
  });

  if (reset) {
    reset.addEventListener("click", () => {
      if (input) {
        input.value = "";
      }
      [year, type, category].forEach((control) => {
        if (control) {
          control.value = "";
        }
      });
      runFilter();
    });
  }

  runFilter();
});
