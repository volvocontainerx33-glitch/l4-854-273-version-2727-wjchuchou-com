(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const query = input ? input.value.trim() : '';
      const target = form.getAttribute('data-search-target') || './search.html';
      const url = query ? `${target}?q=${encodeURIComponent(query)}` : target;
      window.location.href = url;
    });
  });

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const nextButton = hero.querySelector('[data-hero-next]');
    const prevButton = hero.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = 0;

    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const startTimer = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(current + 1), 5200);
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showSlide(current + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (slides.length > 1) {
      startTimer();
    }
  }

  const normalize = (value) => (value || '').toString().trim().toLowerCase();

  const runFilter = () => {
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const input = document.querySelector('[data-filter-input]') || document.getElementById('search-query');
    const activeButton = document.querySelector('[data-filter-value].is-active');
    const emptyState = document.querySelector('[data-empty-state]');
    const keyword = normalize(input ? input.value : '');
    const activeValue = activeButton ? activeButton.getAttribute('data-filter-value') : 'all';
    let visible = 0;

    cards.forEach((card) => {
      const text = normalize(card.getAttribute('data-tags'));
      const type = normalize(card.getAttribute('data-type'));
      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesType = !activeValue || activeValue === 'all' || type.includes(normalize(activeValue)) || text.includes(normalize(activeValue));
      const show = matchesKeyword && matchesType;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  };

  document.querySelectorAll('[data-filter-input]').forEach((input) => {
    input.addEventListener('input', runFilter);
  });

  document.querySelectorAll('[data-filter-value]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-value]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      runFilter();
    });
  });

  const searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const input = document.getElementById('search-query');

    if (input) {
      input.value = query;
      input.addEventListener('input', runFilter);
    }

    runFilter();
  }
})();
