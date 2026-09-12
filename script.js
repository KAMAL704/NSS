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
  if (!progress) return;

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
      parallaxRoot.style.transform = `perspective(900px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
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
      card.style.transform = `translate(${x * 8}px, ${y * 8}px) rotate(${x * 3}deg)`;
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
    if (animated) return;
    animated = true;

    const duration = prefersReduced ? 0 : 1100;
    const start = performance.now();

    const tick = (now) => {
      const progressValue = duration === 0
        ? 1
        : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = Math.floor(eased * target);

      if (progressValue < 1) requestAnimationFrame(tick);
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
  () => document.documentElement.style.setProperty('--scrollY', `${window.scrollY * 0.04}px`),
  { passive: true }
);

/*
 * Shared NSS SLIET branding.
 * Every page uses the supplied JPEG emblem for a consistent logo.
 */
document.querySelectorAll('.brand img').forEach((logo) => {
  logo.src = 'assets/logo.jpeg';
  logo.removeAttribute('srcset');
  logo.alt = 'NSS SLIET official logo';
});

/*
 * Shared social links.
 * This small dock appears on every page without duplicating markup in each HTML file.
 */
const socialDock = document.createElement('div');
socialDock.className = 'nss-social-dock';
socialDock.setAttribute('aria-label', 'NSS SLIET social links');
socialDock.innerHTML = `
  <span class="nss-social-label">NSS SLIET</span>
  <a href="https://www.instagram.com/nss_sliet/" target="_blank" rel="noopener" aria-label="NSS SLIET Instagram">Instagram ↗</a>
  <a href="https://www.linkedin.com/company/official-sliet/" target="_blank" rel="noopener" aria-label="SLIET LinkedIn">LinkedIn ↗</a>
`;

document.body.appendChild(socialDock);
