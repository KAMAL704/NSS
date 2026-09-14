/* NSS SLIET motion layer
   Lightweight vanilla JS: no framework required. */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.querySelector(".scroll-progress");
  const parallaxItems = document.querySelectorAll("[data-nss-parallax]");
  const revealItems = document.querySelectorAll(".nss-reveal");

  const updateProgress = () => {
    if (!progress) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${value}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));

  window.addEventListener(
    "pointermove",
    (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      parallaxItems.forEach((item) => {
        const strength = Number(item.dataset.nssParallax) || 10;
        item.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    },
    { passive: true }
  );
})();
