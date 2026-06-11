const doc = document.documentElement;
const hero = document.querySelector(".hero");
const filmStrip = document.querySelector(".film-strip");
const filmTrack = document.querySelector(".film-track");
const stickyImage = document.querySelector(".sticky-product img");
const form = document.querySelector("#preorder-form");
const formNote = document.querySelector("#form-note");
const stockModal = document.querySelector("#stock-modal");
const stockDialog = document.querySelector(".stock-dialog");
const stockConfirm = document.querySelector("#stock-confirm");
const stockCancelButtons = document.querySelectorAll("[data-stock-cancel]");
const orderTriggers = document.querySelectorAll(".order-trigger");

let pendingOrderData = null;
let orderModalContext = "cta";
let previousFocus = null;
let stockCheckTimer = null;
let stockSaveTimer = null;

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  document.body.classList.remove("is-loading");
  document.querySelectorAll(".hero .reveal").forEach((node, index) => {
    window.setTimeout(() => node.classList.add("is-visible"), 180 + index * 140);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal:not(.hero .reveal)").forEach((node) => {
  revealObserver.observe(node);
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (button.classList.contains("order-trigger") || event.defaultPrevented) return;
    document.getElementById(button.dataset.scrollTo)?.scrollIntoView({ behavior: "smooth" });
  });
});

function openStockModal(context = "cta") {
  if (!stockModal) return;

  orderModalContext = context;
  previousFocus = document.activeElement;
  stockModal.hidden = false;
  stockModal.classList.remove("is-ready", "is-saving", "is-success");
  stockModal.classList.add("is-checking");
  document.body.classList.add("modal-open");

  stockDialog?.focus({ preventScroll: true });

  window.clearTimeout(stockCheckTimer);
  window.clearTimeout(stockSaveTimer);
  stockCheckTimer = window.setTimeout(() => {
    stockModal.classList.remove("is-checking");
    stockModal.classList.add("is-ready");
    stockConfirm?.focus({ preventScroll: true });
  }, 1650);
}

function closeStockModal({ restoreFocus = true, clearPending = true } = {}) {
  if (!stockModal) return;

  window.clearTimeout(stockCheckTimer);
  window.clearTimeout(stockSaveTimer);
  stockModal.hidden = true;
  stockModal.classList.remove("is-checking", "is-ready", "is-saving", "is-success");
  document.body.classList.remove("modal-open");
  orderModalContext = "cta";
  if (clearPending) pendingOrderData = null;

  if (restoreFocus && previousFocus instanceof HTMLElement) {
    previousFocus.focus({ preventScroll: true });
  }
}

function saveOrderInterest(data) {
  const existing = JSON.parse(localStorage.getItem("roam-bar-preorders") || "[]");
  existing.push({
    ...data,
    intent: "preorder-waitlist",
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("roam-bar-preorders", JSON.stringify(existing));
}

orderTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openStockModal("cta");
  });
});

stockCancelButtons.forEach((button) => {
  button.addEventListener("click", () => closeStockModal());
});

stockModal?.addEventListener("click", (event) => {
  if (event.target === stockModal) closeStockModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && stockModal && !stockModal.hidden) {
    closeStockModal();
  }
});

stockConfirm?.addEventListener("click", () => {
  if (orderModalContext === "form" && pendingOrderData && form) {
    saveOrderInterest(pendingOrderData);
    pendingOrderData = null;
    form.reset();
    if (formNote) {
      formNote.textContent = "You have joined the Roamboard pre-order queue. We will send updates by email.";
    }
    window.clearTimeout(stockCheckTimer);
    window.clearTimeout(stockSaveTimer);
    stockModal.classList.remove("is-checking", "is-ready", "is-success");
    stockModal.classList.add("is-saving");
    stockDialog?.focus({ preventScroll: true });
    stockSaveTimer = window.setTimeout(() => {
      stockModal.classList.remove("is-saving");
      stockModal.classList.add("is-success");
      stockDialog?.focus({ preventScroll: true });
    }, 850);
    return;
  }

  closeStockModal({ restoreFocus: false });
  document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollMotion() {
  const y = window.scrollY;
  const vh = window.innerHeight || 1;

  if (hero) {
    const heroProgress = clamp(y / vh, 0, 1);
    doc.style.setProperty("--hero-scale", String(1 + heroProgress * 0.065));
  }

  if (filmStrip && filmTrack && window.matchMedia("(min-width: 901px)").matches) {
    const rect = filmStrip.getBoundingClientRect();
    const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    const travel = Math.max(filmTrack.scrollWidth - window.innerWidth + 160, 0);
    doc.style.setProperty("--film-x", `${-travel * progress}px`);
  }

  if (stickyImage) {
    const rect = stickyImage.getBoundingClientRect();
    const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    doc.style.setProperty("--detail-scale", String(1.07 - progress * 0.055));
  }
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollMotion();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateScrollMotion);
updateScrollMotion();

window.addEventListener("pointermove", (event) => {
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = hero.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  doc.style.setProperty("--pointer-x", x.toFixed(3));
  doc.style.setProperty("--pointer-y", y.toFixed(3));
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  pendingOrderData = Object.fromEntries(new FormData(form).entries());
  openStockModal("form");
});
