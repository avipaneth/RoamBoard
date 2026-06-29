const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealGroups = [
  [".travel-smarter-panel", "motion-reveal"],
  [".colourway-card", "motion-reveal"],
  [".destination-check-header", "motion-reveal-soft"],
  [".destination-check-panel", "motion-reveal"],
  [".adapter-story-header", "motion-reveal-soft"],
  [".adapter-feature", "motion-reveal"],
  [".adapter-story-callout", "motion-reveal-soft"],
  [".adapter-lifestyle-image", "motion-reveal"],
  [".adventure-picker-header", "motion-reveal-soft"],
  [".picker-shell", "motion-reveal"],
  [".need-to-know-header", "motion-reveal-soft"],
  [".know-card", "motion-reveal"],
  [".get-roamboard-panel", "motion-reveal"],
  [".site-footer", "motion-reveal-soft"],
  [".info-page-shell > div:first-child", "motion-reveal-soft"],
  [".info-card", "motion-reveal"],
];

const revealNodes = revealGroups.flatMap(([selector, className]) =>
  Array.from(document.querySelectorAll(selector)).map((node, index) => ({ node, className, index }))
);

if (prefersReducedMotion) {
  revealNodes.forEach(({ node }) => node.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  revealNodes.forEach(({ node, className, index }) => {
    node.classList.add(className);
    node.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "18% 0px -4% 0px" }
  );

  revealNodes.forEach(({ node }) => observer.observe(node));
} else {
  revealNodes.forEach(({ node }) => node.classList.add("is-visible"));
}

const floatingCta = document.querySelector("[data-floating-cta]");
const floatingCtaMessage = document.querySelector("[data-floating-cta-message]");

if (floatingCta && floatingCtaMessage) {
  const heroSection = document.querySelector(".hero");
  const stopSection = document.querySelector(".need-to-know");
  const messages = [
    { text: "500+ Roamboards reserved this week" },
    { text: "20,000+ happy customers" },
    { text: "5-star rated", stars: "★★★★★" },
  ];
  let messageIndex = 0;
  let ticking = false;

  const renderFloatingMessage = () => {
    const message = messages[messageIndex];
    floatingCtaMessage.innerHTML = message.stars
      ? `<span>${message.text}</span><span class="floating-cta-stars" aria-label="5 stars">${message.stars}</span>`
      : `<span>${message.text}</span>`;
  };

  const cycleFloatingMessage = () => {
    floatingCta.classList.add("is-swapping");
    window.setTimeout(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      renderFloatingMessage();
      floatingCta.classList.remove("is-swapping");
    }, 180);
  };

  const updateFloatingCta = () => {
    ticking = false;

    if (!heroSection || !stopSection) return;

    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const bottomOffset = isMobile ? 24 : 26;
    const ctaHeight = floatingCta.offsetHeight;
    const heroBottom = heroSection.getBoundingClientRect().bottom + scrollY;
    const stopBottom = stopSection.getBoundingClientRect().bottom + scrollY;
    const pinnedTop = Math.max(heroBottom + 24, stopBottom - ctaHeight - bottomOffset);
    const viewportCtaTop = scrollY + viewportHeight - bottomOffset - ctaHeight;
    const shouldShow = scrollY > heroBottom - 8;

    floatingCta.classList.toggle("is-visible", shouldShow);

    if (!shouldShow) {
      floatingCta.classList.remove("is-pinned");
      floatingCta.style.top = "";
      return;
    }

    if (viewportCtaTop >= pinnedTop) {
      floatingCta.classList.add("is-pinned");
      floatingCta.style.top = `${pinnedTop}px`;
    } else {
      floatingCta.classList.remove("is-pinned");
      floatingCta.style.top = "";
    }
  };

  const requestFloatingCtaUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateFloatingCta);
  };

  renderFloatingMessage();
  updateFloatingCta();

  if (!prefersReducedMotion) {
    window.setInterval(cycleFloatingMessage, 3600);
  }

  window.addEventListener("scroll", requestFloatingCtaUpdate, { passive: true });
  window.addEventListener("resize", requestFloatingCtaUpdate);
  window.addEventListener("load", requestFloatingCtaUpdate);
  window.addEventListener("pageshow", requestFloatingCtaUpdate);
}
