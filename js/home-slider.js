(() => {
  const slides = Array.from(document.querySelectorAll('.nss-slide'));
  const dots = Array.from(document.querySelectorAll('[data-slide-dot]'));
  const previous = document.querySelector('[data-slide-prev]');
  const next = document.querySelector('[data-slide-next]');

  if (!slides.length) {
    return;
  }

  let current = 0;
  let timer;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function restartAutoPlay() {
    window.clearInterval(timer);

    if (reduceMotion || slides.length < 2) {
      return;
    }

    timer = window.setInterval(() => {
      showSlide(current + 1);
    }, 5500);
  }

  previous?.addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoPlay();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      restartAutoPlay();
    });
  });

  const slider = document.querySelector('.nss-slider');

  slider?.addEventListener('mouseenter', () => {
    window.clearInterval(timer);
  });

  slider?.addEventListener('mouseleave', restartAutoPlay);

  let touchStartX = 0;

  slider?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  slider?.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 45) {
      return;
    }

    showSlide(distance > 0 ? current - 1 : current + 1);
    restartAutoPlay();
  }, { passive: true });

  showSlide(0);
  restartAutoPlay();
})();
