/*
 * NSS SLIET — Greenery Motion Engine
 */

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    document.documentElement.classList.add("motion-reduced");
    return;
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const parallaxItems = document.querySelectorAll("[data-parallax]");

  window.addEventListener(
    "scroll",
    () => {
      const offset = window.scrollY;
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax) || 0.04;
        item.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
      });
    },
    { passive: true }
  );

  const tiltItems = document.querySelectorAll("[data-tilt]");

  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
})();
