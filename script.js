import { getSupabaseClient } from "./supabaseClient.js";

const doc = document.documentElement;
const hero = document.querySelector(".hero");
const filmStrip = document.querySelector(".film-strip");
const filmTrack = document.querySelector(".film-track");
const stickyImage = document.querySelector("[data-design-image-display]");
const designSpecs = Array.from(document.querySelectorAll(".spec[data-design-image]"));
const preorderForm = document.querySelector("#preorder-form");
const preorderNote = document.querySelector("#preorder-note");
const preorderSubmit = document.querySelector("#preorder-submit");
const preorderColourSelect = document.querySelector("[data-preorder-colour]");
const orderTriggers = document.querySelectorAll(".order-trigger");
const colourPicker = document.querySelector("[data-colour-picker]");
const colourPreview = document.querySelector("[data-colour-preview]");
const colourName = document.querySelector("[data-colour-selected-name]");
const colourCopy = document.querySelector("[data-colour-selected-copy]");
const colourSelectedSentence = document.querySelector("[data-colour-selected-sentence]");
const colourViewLabel = document.querySelector("[data-colour-view-label]");
const destinationSelect = document.querySelector("[data-destination-select]");
const destinationResult = document.querySelector("[data-destination-result]");

let activeDesignImage = stickyImage?.getAttribute("src") || "";
let designSwapTimer = null;
let selectedColourInput = document.querySelector(".colour-swatch input:checked") || null;
let selectedColourView = "angle";
let colourSentenceTimer = null;
let isSubmittingPreorder = false;
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

designSpecs.forEach((spec) => {
  if (!spec.dataset.designImage) return;
  const image = new Image();
  image.src = spec.dataset.designImage;
});

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

orderTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  });
});

function getColourKey(input) {
  if (!(input instanceof HTMLInputElement)) return "";
  return input.dataset.colourValue || input.value;
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

function updateColourPreview({ animate = true } = {}) {
  if (!(selectedColourInput instanceof HTMLInputElement) || !colourPreview) return;

  const selectedColour = getColourKey(selectedColourInput);
  const view = colourViewImages[selectedColour]?.[selectedColourView] || colourViewImages[selectedColour]?.angle;
  if (!view) return;

  const applyImage = () => {
    colourPreview.src = view.src;
    colourPreview.alt = view.alt;
    if (colourViewLabel) colourViewLabel.textContent = colourViewLabels[selectedColourView] || "Angle view";
    colourPreview.classList.remove("is-changing");
    scheduleAdjacentColourPreload();
  };

  if (animate) {
    colourPreview.classList.add("is-changing");
    window.setTimeout(applyImage, 140);
  } else {
    applyImage();
  }
}

function updateColourChoice(input) {
  if (!(input instanceof HTMLInputElement) || !input.closest(".colour-swatch")) return;

  const { colourName: selectedName, colourCopy: selectedCopy } = input.dataset;
  const selectedKey = getColourKey(input);
  if (!selectedKey) return;

  input.checked = true;
  selectedColourInput = input;
  syncColourSwatches(selectedKey);

  if (colourName) colourName.textContent = selectedName;
  if (colourCopy && selectedCopy) colourCopy.textContent = selectedCopy;
  updateColourSentence(input);
  updateColourPreview();
  syncPreorderColourFromSelectedColour();
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

document.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.closest(".colour-swatch")) return;
  updateColourChoice(event.target);
});

colourPicker?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const viewButton = event.target.closest("[data-colour-view-direction]");
  if (!(viewButton instanceof HTMLButtonElement)) return;

  const direction = viewButton.dataset.colourViewDirection;
  const currentIndex = colourViewOrder.indexOf(selectedColourView);
  const nextIndex =
    direction === "previous"
      ? (currentIndex - 1 + colourViewOrder.length) % colourViewOrder.length
      : (currentIndex + 1) % colourViewOrder.length;
  selectedColourView = colourViewOrder[nextIndex];
  updateColourPreview();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const label = event.target.closest(".colour-swatch");
  if (!(label instanceof HTMLLabelElement)) return;
  const input = label.querySelector("input");
  if (!(input instanceof HTMLInputElement)) return;
  input.checked = true;
  updateColourChoice(input);
});

updateColourPreview({ animate: false });

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
    icon.textContent = result.status === "compatible" ? "✓" : result.status === "incompatible" ? "×" : "!";
  }
  if (message) message.textContent = result.message;
}

destinationSelect?.addEventListener("change", updateDestinationResult);
updateDestinationResult();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setDesignImage(spec) {
  if (!stickyImage || !spec) return;

  const nextImage = spec.dataset.designImage;
  if (!nextImage) return;

  designSpecs.forEach((node) => {
    node.classList.toggle("is-active", node === spec);
  });

  if (activeDesignImage === nextImage) return;

  activeDesignImage = nextImage;
  stickyImage.classList.add("is-changing");
  stickyImage.src = nextImage;
  stickyImage.alt = spec.dataset.designAlt || stickyImage.alt;
  window.clearTimeout(designSwapTimer);
  designSwapTimer = window.setTimeout(() => {
    stickyImage.classList.remove("is-changing");
  }, 120);
}

function updateDesignImage() {
  if (!stickyImage || !designSpecs.length) return;

  const vh = window.innerHeight || 1;
  const targetY = vh * 0.52;
  let activeSpec = designSpecs[0];

  designSpecs.forEach((spec) => {
    const rect = spec.getBoundingClientRect();
    if (rect.top <= targetY) {
      activeSpec = spec;
    }
  });

  setDesignImage(activeSpec);
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

  updateDesignImage();
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
      "The early access list is not connected just yet. Please email hello@roamboard.com.au and we'll add you manually.",
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
          : "We couldn't save your details just now. Please try again or email hello@roamboard.com.au.",
        isDuplicatePreorderError(error) ? "success" : "error"
      );
      return;
    }

    preorderForm.reset();
    syncPreorderColourFromSelectedColour();
    setPreorderNote("Thanks - you're on the early access list. We'll contact you before launch.", "success");
  } catch {
    setPreorderNote("We couldn't save your details just now. Please try again or email hello@roamboard.com.au.", "error");
  } finally {
    setPreorderLoading(false);
  }
});

syncPreorderColourFromSelectedColour();
