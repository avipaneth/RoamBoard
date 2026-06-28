const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealGroups = [
  [".colourway-card", "motion-reveal"],
  [".adapter-story-header", "motion-reveal-soft"],
  [".adapter-feature", "motion-reveal"],
  [".adapter-story-callout", "motion-reveal-soft"],
  [".adapter-lifestyle-image", "motion-reveal"],
  [".adventure-picker-header", "motion-reveal-soft"],
  [".picker-shell", "motion-reveal"],
  [".destination-check-header", "motion-reveal-soft"],
  [".destination-check-panel", "motion-reveal"],
  [".need-to-know-header", "motion-reveal-soft"],
  [".know-card", "motion-reveal"],
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
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealNodes.forEach(({ node }) => observer.observe(node));
} else {
  revealNodes.forEach(({ node }) => node.classList.add("is-visible"));
}
