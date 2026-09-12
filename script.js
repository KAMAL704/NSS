const menu = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const revealItems = document.querySelectorAll('.reveal');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const progress = document.querySelector('.scroll-progress');

function updateScrollProgress() {
  if (!progress) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${percentage}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

if (!prefersReduced) {
  const parallaxRoot = document.querySelector('[data-parallax-root]');

  if (parallaxRoot) {
    parallaxRoot.addEventListener('pointermove', (event) => {
      const rect = parallaxRoot.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      parallaxRoot.style.transform =
        `perspective(900px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    });

    parallaxRoot.addEventListener('pointerleave', () => {
      parallaxRoot.style.transform = '';
    });
  }

  document.querySelectorAll('.hero-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `translate(${x * 8}px, ${y * 8}px) rotate(${x * 3}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

document.querySelectorAll('[data-count]').forEach((element) => {
  const target = Number(element.dataset.count);
  let animated = false;

  const animateCounter = () => {
    if (animated) {
      return;
    }

    animated = true;
    const duration = prefersReduced ? 0 : 1100;
    const start = performance.now();

    const tick = (now) => {
      const progressValue = duration === 0
        ? 1
        : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);

      element.textContent = Math.floor(eased * target);

      if (progressValue < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        animateCounter();
        observer.disconnect();
      }
    });

    counterObserver.observe(element);
  } else {
    animateCounter();
  }
});

window.addEventListener(
  'scroll',
  () => {
    document.documentElement.style.setProperty(
      '--scrollY',
      `${window.scrollY * 0.04}px`
    );
  },
  { passive: true }
);

/* Always use the supplied NSS JPEG as the shared visible logo. */
document.querySelectorAll('.brand img').forEach((logo) => {
  logo.src = 'assets/logo.jpeg';
  logo.removeAttribute('srcset');
  logo.alt = 'NSS SLIET official logo';
});

/* Shared social links. */
const socialStylesheet = document.createElement('link');
socialStylesheet.rel = 'stylesheet';
socialStylesheet.href = 'css/social-links.css';
document.head.appendChild(socialStylesheet);

const socialDock = document.createElement('div');
socialDock.className = 'nss-social-dock';
socialDock.setAttribute('aria-label', 'NSS SLIET social links');
socialDock.innerHTML = `
  <span class="nss-social-label">NSS SLIET</span>
  <a
    href="https://www.instagram.com/nss_sliet/"
    target="_blank"
    rel="noopener"
    aria-label="NSS SLIET Instagram"
  >
    Instagram ↗
  </a>
  <a
    href="https://www.linkedin.com/company/official-sliet/"
    target="_blank"
    rel="noopener"
    aria-label="SLIET LinkedIn"
  >
    LinkedIn ↗
  </a>
`;

document.body.appendChild(socialDock);

/*
 * NSS SLIET homepage photo carousel.
 * The carousel follows the institutional photo-slider pattern requested
 * for the front page and supports autoplay, arrows, dots and touch swipe.
 */
const homeSlider = document.querySelector('.nss-home-slider');

if (homeSlider) {
  const slides = Array.from(
    homeSlider.querySelectorAll('.nss-home-slide')
  );
  const dots = Array.from(
    homeSlider.querySelectorAll('[data-slider-dot]')
  );
  const previousButton = homeSlider.querySelector('[data-slider-prev]');
  const nextButton = homeSlider.querySelector('[data-slider-next]');
  const toggleButton = homeSlider.querySelector('[data-slider-toggle]');
  const currentNumber = homeSlider.querySelector('[data-slide-current]');
  const status = homeSlider.querySelector('[data-slider-status]');

  let currentSlide = 0;
  let sliderTimer = null;
  let touchStartX = 0;
  let autoplayPaused = false;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (currentNumber) {
      currentNumber.textContent = String(currentSlide + 1).padStart(2, '0');
    }

    if (status) {
      status.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
    }
  }

  function stopSlider() {
    if (sliderTimer) {
      window.clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  function startSlider() {
    if (prefersReduced || autoplayPaused || slides.length < 2) {
      return;
    }

    stopSlider();
    sliderTimer = window.setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5500);
  }

  function previousSlide() {
    showSlide(currentSlide - 1);
    startSlider();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
    startSlider();
  }

  previousButton?.addEventListener('click', previousSlide);
  nextButton?.addEventListener('click', nextSlide);

  toggleButton?.addEventListener('click', () => {
    autoplayPaused = !autoplayPaused;
    toggleButton.textContent = autoplayPaused ? '▶' : 'Ⅱ';
    toggleButton.setAttribute('aria-pressed', String(autoplayPaused));
    toggleButton.setAttribute(
      'aria-label',
      autoplayPaused ? 'Start automatic slides' : 'Pause automatic slides'
    );

    if (autoplayPaused) {
      stopSlider();
    } else {
      startSlider();
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.sliderDot));
      startSlider();
    });
  });

  homeSlider.addEventListener('mouseenter', stopSlider);
  homeSlider.addEventListener('mouseleave', startSlider);
  homeSlider.addEventListener('focusin', stopSlider);
  homeSlider.addEventListener('focusout', startSlider);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSlider();
    } else {
      startSlider();
    }
  });

  homeSlider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      previousSlide();
    }

    if (event.key === 'ArrowRight') {
      nextSlide();
    }
  });

  homeSlider.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  homeSlider.addEventListener(
    'touchend',
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance > 0) {
        previousSlide();
      } else {
        nextSlide();
      }
    },
    { passive: true }
  );

  homeSlider.tabIndex = 0;
  showSlide(0);
  startSlider();
}
