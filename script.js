import { getSupabaseClient } from "./supabaseClient.js";

const doc = document.documentElement;
const hero = document.querySelector(".hero");
const preorderForm = document.querySelector("#preorder-form");
const preorderNote = document.querySelector("#preorder-note");
const preorderSubmit = document.querySelector("#preorder-submit");
const preorderColourSelect = document.querySelector("[data-preorder-colour]");
const orderTriggers = document.querySelectorAll(".order-trigger");
const colourPicker = document.querySelector("[data-colour-picker]");
const colourPreview = document.querySelector("[data-colour-preview]");
const colourSelectedSentence = document.querySelector("[data-colour-selected-sentence]");
const colourViewLabel = document.querySelector("[data-colour-view-label]");
const destinationSelect = document.querySelector("[data-destination-select]");
const destinationResult = document.querySelector("[data-destination-result]");
const featureButtons = Array.from(document.querySelectorAll("[data-feature-button]"));
const featurePanels = Array.from(document.querySelectorAll("[data-feature-panel]"));
const highlightReel = document.querySelector("[data-highlight-reel]");
const highlightDots = Array.from(document.querySelectorAll("[data-reel-dot]"));
const highlightPause = document.querySelector("[data-reel-pause]");

let selectedColourInput = document.querySelector(".colour-swatch input:checked") || null;
let selectedColourView = "angle";
let activeFeature = "colours";
let colourSentenceTimer = null;
let imageSwapTimer = null;
let isSubmittingPreorder = false;
let highlightTimer = null;
let highlightIndex = 0;
let highlightsPaused = false;

const colourViewOrder = ["angle", "top", "detail"];
const colourViewLabels = {
  angle: "Angle view",
  top: "Top view",
  detail: "Detail view",
};

const colourViewImages = {
  brown: {
    angle: {
      src: "assets/optimized/roam-brown-angle-1120w.webp",
      alt: "Chocolate Brown Roamboard travel powerboard angled view",
    },
    top: {
      src: "assets/optimized/roam-brown-top-1120w.webp",
      alt: "Chocolate Brown Roamboard travel powerboard top view",
    },
    detail: {
      src: "assets/optimized/roam-brown-detail-1120w.webp",
      alt: "Chocolate Brown Roamboard travel powerboard close detail",
    },
  },
  orange: {
    angle: {
      src: "assets/optimized/roam-orange-angle-1120w.webp",
      alt: "Cosmic Orange Roamboard travel powerboard angled view",
    },
    top: {
      src: "assets/optimized/roam-orange-top-1120w.webp",
      alt: "Cosmic Orange Roamboard travel powerboard top view",
    },
    detail: {
      src: "assets/optimized/roam-orange-detail-1120w.webp",
      alt: "Cosmic Orange Roamboard travel powerboard close detail",
    },
  },
  blue: {
    angle: {
      src: "assets/optimized/roam-blue-angle-1120w.webp",
      alt: "Baby Blue Roamboard travel powerboard angled view",
    },
    top: {
      src: "assets/optimized/roam-blue-top-1120w.webp",
      alt: "Baby Blue Roamboard travel powerboard top view",
    },
    detail: {
      src: "assets/optimized/roam-blue-detail-1120w.webp",
      alt: "Baby Blue Roamboard travel powerboard close detail",
    },
  },
};

const destinationCompatibility = {
  Austria: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Austria.",
  },
  Belgium: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type E sockets commonly used in Belgium.",
  },
  Croatia: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Croatia.",
  },
  France: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type E sockets commonly used in France.",
  },
  Germany: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type F sockets commonly used in Germany.",
  },
  Greece: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Greece.",
  },
  Indonesia: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Indonesia, including Bali.",
  },
  Italy: {
    status: "caution",
    message: "Usually. Italy uses Type C/F in many places, but some Type L sockets may need a separate adapter.",
  },
  Japan: {
    status: "incompatible",
    message: "No. Japan commonly uses Type A/B sockets, so Roamboard will not plug in directly.",
  },
  Morocco: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/E sockets commonly used in Morocco.",
  },
  Netherlands: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in the Netherlands.",
  },
  Portugal: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Portugal.",
  },
  Singapore: {
    status: "incompatible",
    message: "No. Singapore commonly uses Type G sockets, so Roamboard will not plug in directly.",
  },
  "South Korea": {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in South Korea.",
  },
  Spain: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Spain.",
  },
  Thailand: {
    status: "caution",
    message: "Sometimes. Thailand uses mixed socket types, so check your accommodation or pack a backup adapter.",
  },
  Turkey: {
    status: "compatible",
    message: "Yes. Roamboard works with the Type C/F sockets commonly used in Turkey.",
  },
  "United Arab Emirates": {
    status: "incompatible",
    message: "No. The UAE commonly uses Type G sockets, so Roamboard will not plug in directly.",
  },
  "United Kingdom": {
    status: "incompatible",
    message: "No. The UK commonly uses Type G sockets, so Roamboard will not plug in directly.",
  },
  "United States": {
    status: "incompatible",
    message: "No. The United States commonly uses Type A/B sockets, so Roamboard will not plug in directly.",
  },
  Vietnam: {
    status: "caution",
    message: "Sometimes. Vietnam uses mixed socket types, so check your accommodation before relying on it.",
  },
};

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  document.body.classList.remove("is-loading");
  document.querySelectorAll(".hero .reveal").forEach((node, index) => {
    window.setTimeout(() => node.classList.add("is-visible"), 120 + index * 130);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal:not(.hero .reveal)").forEach((node) => {
    revealObserver.observe(node);
  });
} else {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
}

orderTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  });
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollMotion() {
  if (!hero) return;
  const y = window.scrollY;
  const vh = window.innerHeight || 1;
  const heroProgress = clamp(y / vh, 0, 1);
  doc.style.setProperty("--hero-scale", String(1 + heroProgress * 0.055));
}

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    window.requestAnimationFrame(() => {
      updateScrollMotion();
      scrollTicking = false;
    });
    scrollTicking = true;
  },
  { passive: true }
);
window.addEventListener("resize", updateScrollMotion);
updateScrollMotion();

function getColourKey(input) {
  if (!(input instanceof HTMLInputElement)) return "";
  return input.value;
}

function getSelectedColourName() {
  if (!(selectedColourInput instanceof HTMLInputElement)) return "Chocolate Brown";
  return selectedColourInput.dataset.colourName || selectedColourInput.value || "Chocolate Brown";
}

function preloadImage(src) {
  if (!src) return;
  const image = new Image();
  image.decoding = "async";
  image.src = src;
}

function preloadAdjacentColourViews() {
  if (!(selectedColourInput instanceof HTMLInputElement)) return;

  const selectedColour = getColourKey(selectedColourInput);
  const currentIndex = colourViewOrder.indexOf(selectedColourView);
  if (!colourViewImages[selectedColour] || currentIndex < 0) return;

  const adjacentViews = [
    colourViewOrder[(currentIndex - 1 + colourViewOrder.length) % colourViewOrder.length],
    colourViewOrder[(currentIndex + 1) % colourViewOrder.length],
  ];

  adjacentViews.forEach((viewName) => {
    preloadImage(colourViewImages[selectedColour]?.[viewName]?.src);
  });
}

function scheduleAdjacentColourPreload() {
  const run = () => preloadAdjacentColourViews();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1200 });
    return;
  }
  window.setTimeout(run, 240);
}

function setViewerImage(src, alt = "") {
  if (!colourPreview || !src) return;
  if (colourPreview.getAttribute("src") === src) return;

  colourPreview.classList.add("is-changing");
  window.clearTimeout(imageSwapTimer);
  imageSwapTimer = window.setTimeout(() => {
    colourPreview.src = src;
    if (alt) colourPreview.alt = alt;
    colourPreview.classList.remove("is-changing");
  }, 130);
}

function syncColourSwatches(selectedKey) {
  document.querySelectorAll(".colour-swatch").forEach((label) => {
    const input = label.querySelector("input");
    if (!(input instanceof HTMLInputElement)) return;
    const isSelected = getColourKey(input) === selectedKey;
    input.checked = isSelected;
    label.classList.toggle("is-selected", isSelected);
  });
}

function updateColourSentence(input) {
  if (!colourSelectedSentence || !(input instanceof HTMLInputElement)) return;
  const displayName = input.dataset.colourDisplay || input.dataset.colourName || input.value;
  const nextText = `Shown in ${displayName}`;
  if (colourSelectedSentence.textContent === nextText) return;

  window.clearTimeout(colourSentenceTimer);
  colourSelectedSentence.classList.add("is-changing");
  colourSentenceTimer = window.setTimeout(() => {
    colourSelectedSentence.textContent = nextText;
    colourSelectedSentence.classList.remove("is-changing");
  }, 145);
}

function updateColourPreview() {
  if (!(selectedColourInput instanceof HTMLInputElement) || !colourPreview) return;

  const selectedColour = getColourKey(selectedColourInput);
  const view = colourViewImages[selectedColour]?.[selectedColourView] || colourViewImages[selectedColour]?.angle;
  if (!view) return;

  setViewerImage(view.src, view.alt);
  if (colourViewLabel) colourViewLabel.textContent = colourViewLabels[selectedColourView] || "Angle view";
  scheduleAdjacentColourPreload();
}

function syncPreorderColourFromSelectedColour() {
  if (!(selectedColourInput instanceof HTMLInputElement)) return;
  syncColourSwatches(getColourKey(selectedColourInput));
  if (preorderColourSelect instanceof HTMLSelectElement) {
    const selectedColour = getSelectedColourName();
    if (Array.from(preorderColourSelect.options).some((option) => option.value === selectedColour)) {
      preorderColourSelect.value = selectedColour;
    }
  }
}

function setActiveFeature(featureKey) {
  activeFeature = featureKey;

  featurePanels.forEach((panel) => {
    const isActive = panel.dataset.featurePanel === featureKey;
    panel.classList.toggle("is-active", isActive);
    const icon = panel.querySelector(".feature-icon");
    icon?.classList.toggle("plus", !isActive);
    icon?.classList.toggle("empty", isActive);
  });

  const activeButton = featureButtons.find((button) => button.dataset.featureTarget === featureKey);
  if (!activeButton) return;

  if (featureKey === "colours") {
    updateColourPreview();
    return;
  }

  const featureImage = activeButton.dataset.featureImage;
  const featureAlt = activeButton.dataset.featureAlt || "";
  setViewerImage(featureImage, featureAlt);
}

function updateColourChoice(input) {
  if (!(input instanceof HTMLInputElement) || !input.closest(".colour-swatch")) return;

  const selectedKey = getColourKey(input);
  if (!selectedKey) return;

  input.checked = true;
  selectedColourInput = input;
  syncColourSwatches(selectedKey);
  updateColourSentence(input);
  setActiveFeature("colours");
  syncPreorderColourFromSelectedColour();
}

document.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.closest(".colour-swatch")) return;
  updateColourChoice(event.target);
});

colourPicker?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const viewButton = event.target.closest("[data-colour-view-direction]");
  if (viewButton instanceof HTMLButtonElement) {
    const direction = viewButton.dataset.colourViewDirection;
    const currentIndex = colourViewOrder.indexOf(selectedColourView);
    selectedColourView =
      direction === "previous"
        ? colourViewOrder[(currentIndex - 1 + colourViewOrder.length) % colourViewOrder.length]
        : colourViewOrder[(currentIndex + 1) % colourViewOrder.length];
    setActiveFeature("colours");
  }
});

featureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.featureTarget;
    if (!target || target === activeFeature) return;
    setActiveFeature(target);
  });
});

syncPreorderColourFromSelectedColour();
updateColourPreview();

function updateHighlightDots(index) {
  highlightIndex = index;
  highlightDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function scrollHighlightTo(index, behavior = "smooth") {
  if (!highlightReel) return;
  const cards = Array.from(highlightReel.querySelectorAll(".highlight-card"));
  const card = cards[index];
  if (!card) return;
  highlightReel.scrollTo({ left: card.offsetLeft - highlightReel.offsetLeft, behavior });
  updateHighlightDots(index);
}

function updateHighlightFromScroll() {
  if (!highlightReel) return;
  const cards = Array.from(highlightReel.querySelectorAll(".highlight-card"));
  if (!cards.length) return;

  const reelLeft = highlightReel.scrollLeft;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const distance = Math.abs(card.offsetLeft - highlightReel.offsetLeft - reelLeft);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  updateHighlightDots(nearestIndex);
}

function startHighlightAutoplay() {
  if (!highlightReel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.clearInterval(highlightTimer);
  highlightTimer = window.setInterval(() => {
    if (highlightsPaused || document.hidden) return;
    const cards = highlightReel.querySelectorAll(".highlight-card");
    if (!cards.length) return;
    scrollHighlightTo((highlightIndex + 1) % cards.length);
  }, 5200);
}

highlightDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number.parseInt(dot.dataset.reelDot || "0", 10);
    highlightsPaused = true;
    if (highlightPause instanceof HTMLButtonElement) {
      highlightPause.setAttribute("aria-pressed", "true");
      highlightPause.setAttribute("aria-label", "Play highlights");
    }
    scrollHighlightTo(index);
  });
});

highlightReel?.addEventListener(
  "scroll",
  () => {
    window.requestAnimationFrame(updateHighlightFromScroll);
  },
  { passive: true }
);

highlightPause?.addEventListener("click", () => {
  highlightsPaused = !highlightsPaused;
  highlightPause.setAttribute("aria-pressed", String(highlightsPaused));
  highlightPause.setAttribute("aria-label", highlightsPaused ? "Play highlights" : "Pause highlights");
});

startHighlightAutoplay();

function updateDestinationResult() {
  if (!destinationSelect || !destinationResult) return;

  const selected = destinationSelect.value;
  const result = destinationCompatibility[selected];
  const icon = destinationResult.querySelector("span");
  const message = destinationResult.querySelector("p");

  destinationResult.classList.remove("is-compatible", "is-incompatible", "is-caution", "is-empty");

  if (!result) {
    destinationResult.classList.add("is-empty");
    if (icon) icon.textContent = "?";
    if (message) message.textContent = "Choose a destination to check compatibility.";
    return;
  }

  destinationResult.classList.add(`is-${result.status}`);
  if (icon) {
    icon.textContent = result.status === "compatible" ? "OK" : result.status === "incompatible" ? "X" : "!";
  }
  if (message) message.textContent = result.message;
}

destinationSelect?.addEventListener("change", updateDestinationResult);
updateDestinationResult();

function setPreorderNote(message, status = "") {
  if (!preorderNote) return;
  preorderNote.textContent = message;
  preorderNote.classList.toggle("is-success", status === "success");
  preorderNote.classList.toggle("is-error", status === "error");
}

function setPreorderLoading(isLoading) {
  isSubmittingPreorder = isLoading;
  if (preorderSubmit instanceof HTMLButtonElement) {
    preorderSubmit.disabled = isLoading;
    preorderSubmit.textContent = isLoading ? "Joining..." : "Join the pre-order list";
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanOptionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function getPreorderPayload(form) {
  const formData = new FormData(form);
  const quantity = Number.parseInt(String(formData.get("quantity") || ""), 10);

  return {
    honeypot: String(formData.get("company") || "").trim(),
    data: {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      quantity,
      colour: cleanOptionalText(formData.get("colour")),
      variant: cleanOptionalText(formData.get("variant")),
      notes: cleanOptionalText(formData.get("notes")),
      marketing_consent: formData.has("marketing_consent"),
      source: "website",
      status: "registered_interest",
    },
  };
}

function validatePreorderPayload(payload) {
  if (!payload.name) return "Please enter your name.";
  if (!isValidEmail(payload.email)) return "Please enter a valid email address.";
  if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
    return "Please choose a quantity of at least 1.";
  }
  return "";
}

function isDuplicatePreorderError(error) {
  const message = String(error?.message || "").toLowerCase();
  return error?.code === "23505" || message.includes("duplicate") || message.includes("unique");
}

preorderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isSubmittingPreorder || !(preorderForm instanceof HTMLFormElement)) return;

  const { data, honeypot } = getPreorderPayload(preorderForm);
  const validationError = validatePreorderPayload(data);

  if (honeypot) {
    setPreorderNote("Thanks - you're on the early access list. We'll contact you before launch.", "success");
    preorderForm.reset();
    syncPreorderColourFromSelectedColour();
    return;
  }

  if (validationError) {
    setPreorderNote(validationError, "error");
    return;
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    setPreorderNote(
      "The early access list is not connected just yet. Please email support@roamboard.shop and we'll add you manually.",
      "error"
    );
    return;
  }

  setPreorderLoading(true);
  setPreorderNote("");

  try {
    const { error } = await supabase.from("preorders").insert(data);

    if (error) {
      setPreorderNote(
        isDuplicatePreorderError(error)
          ? "Looks like you're already on the list."
          : "We couldn't save your details just now. Please try again or email support@roamboard.shop.",
        isDuplicatePreorderError(error) ? "success" : "error"
      );
      return;
    }

    preorderForm.reset();
    syncPreorderColourFromSelectedColour();
    setPreorderNote("Thanks - you're on the early access list. We'll contact you before launch.", "success");
  } catch {
    setPreorderNote("We couldn't save your details just now. Please try again or email support@roamboard.shop.", "error");
  } finally {
    setPreorderLoading(false);
  }
});
