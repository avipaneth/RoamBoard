const modal = document.querySelector("[data-checkout-modal]");
const form = document.querySelector("[data-checkout-form]");
const colourSelect = document.querySelector("select[data-checkout-colour]");
const stockPill = document.querySelector("[data-stock-pill]");
const stockMessage = document.querySelector("[data-stock-message]");
const mobileStockCallout = document.querySelector("[data-mobile-stock-callout]");
const submitButton = document.querySelector("[data-checkout-submit]");
const note = document.querySelector("[data-checkout-note]");
const quantityInput = form?.querySelector('input[name="quantity"]');
const colourDot = document.querySelector("[data-checkout-colour-dot]");
const summaryQuantity = document.querySelector("[data-summary-quantity]");
const summaryOriginal = document.querySelector("[data-summary-original]");
const summarySaving = document.querySelector("[data-summary-saving]");
const summaryTotal = document.querySelector("[data-summary-total]");
const shareButton = document.querySelector("[data-share-link]");
const shareToast = document.querySelector("[data-share-toast]");
const checkoutKicker = document.querySelector(".checkout-kicker");
const checkoutTitle = document.querySelector("#checkout-title");
const checkoutDescription = document.querySelector("#checkout-description");
const closeButtons = Array.from(document.querySelectorAll("[data-checkout-close]"));
const triggers = Array.from(document.querySelectorAll("[data-checkout-trigger]"));

const ORIGINAL_PRICE = 69.95;
const PROMO_PRICE = 54.95;
const SHARE_URL = "https://roamboard.shop/";
const CLIENT_ID_STORAGE_KEY = "roamboard_client_id";
const checkoutCopy = {
  checkout: {
    kicker: "Roamboard",
    title: "Power, anywhere.",
    description: "Three AU sockets, two USB-C ports and one longer cord for travel setups.",
  },
  checking: {
    kicker: "Checking stock",
    title: "One moment.",
    description: "We’re checking today’s batch before you go any further.",
  },
  preorder: {
    kicker: "Pre-order available",
    title: "Bummer, our stock is telling us we’re out right now.",
    description: "If you pre-order now, you'll secure your spot on the waitlist and still get access to any current promotion.",
  },
};
const colourLabels = {
  brown: "Chocolate Brown",
  blue: "Baby Blue",
  orange: "Cosmic Orange",
};
const colourSwatchClasses = {
  "Chocolate Brown": "is-brown",
  "Baby Blue": "is-blue",
  "Cosmic Orange": "is-orange",
};

let lastFocusedElement = null;
let stockTimer = null;
let toastTimer = null;
let isSubmitting = false;
let supabaseClient = null;
let checkoutStage = "checkout";
let sessionClientId = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const config = window.ROAMBOARD_SUPABASE_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.warn("Supabase client could not be initialized.", error);
    return null;
  }

  return supabaseClient;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanOptionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function createClientId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getClientId() {
  if (sessionClientId) return sessionClientId;

  try {
    const savedClientId = window.localStorage?.getItem(CLIENT_ID_STORAGE_KEY);
    if (savedClientId) {
      sessionClientId = savedClientId;
      return sessionClientId;
    }

    sessionClientId = createClientId();
    window.localStorage?.setItem(CLIENT_ID_STORAGE_KEY, sessionClientId);
    return sessionClientId;
  } catch {
    sessionClientId = createClientId();
    return sessionClientId;
  }
}

function setNote(message, status = "") {
  if (!note) return;
  note.textContent = message;
  note.classList.toggle("is-success", status === "success");
  note.classList.toggle("is-error", status === "error");
}

function formatCurrency(value) {
  return `A$${value.toFixed(2)}`;
}

function getDisplayQuantity() {
  const rawQuantity = Number.parseInt(String(quantityInput?.value || ""), 10);
  return Number.isInteger(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
}

function updateOrderSummary() {
  const quantity = getDisplayQuantity();
  const originalSubtotal = quantity * ORIGINAL_PRICE;
  const promoSubtotal = quantity * PROMO_PRICE;
  const saving = originalSubtotal - promoSubtotal;

  if (summaryQuantity) summaryQuantity.textContent = `${quantity} ${quantity === 1 ? "board" : "boards"}`;
  if (summaryOriginal) summaryOriginal.textContent = formatCurrency(originalSubtotal);
  if (summarySaving) summarySaving.textContent = `-${formatCurrency(saving)}`;
  if (summaryTotal) summaryTotal.textContent = formatCurrency(promoSubtotal);
}

function updateColourSwatch() {
  if (!colourDot || !(colourSelect instanceof HTMLSelectElement)) return;
  colourDot.classList.remove("is-brown", "is-blue", "is-orange");
  colourDot.classList.add(colourSwatchClasses[colourSelect.value] || "is-brown");
}

function showShareToast() {
  if (!shareToast) return;
  window.clearTimeout(toastTimer);
  shareToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    shareToast.classList.remove("is-visible");
  }, 2200);
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(SHARE_URL);
  } catch {
    try {
      const fallbackInput = document.createElement("textarea");
      fallbackInput.value = SHARE_URL;
      fallbackInput.setAttribute("readonly", "");
      fallbackInput.style.position = "fixed";
      fallbackInput.style.left = "-9999px";
      document.body.appendChild(fallbackInput);
      fallbackInput.select();
      document.execCommand("copy");
      fallbackInput.remove();
    } catch {
      // Keep the confirmation flow calm even if clipboard access is restricted.
    }
  }

  showShareToast();
}

function setSubmitting(nextSubmitting) {
  isSubmitting = nextSubmitting;
  if (!(submitButton instanceof HTMLButtonElement)) return;
  submitButton.disabled = nextSubmitting;
  if (checkoutStage === "preorder") {
    submitButton.textContent = nextSubmitting ? "Joining..." : "Join the pre-order list";
  } else {
    submitButton.textContent = nextSubmitting ? "Checking stock..." : "Buy now";
  }
}

function setSummaryCopy(stage) {
  const copy = checkoutCopy[stage] || checkoutCopy.checkout;
  if (checkoutKicker) checkoutKicker.textContent = copy.kicker;
  if (checkoutTitle) checkoutTitle.textContent = copy.title;
  if (checkoutDescription) checkoutDescription.textContent = copy.description;
}

function setStockState(state) {
  if (!stockPill || !stockMessage || !(submitButton instanceof HTMLButtonElement)) return;

  stockPill.classList.remove("is-hidden", "is-checking", "is-out");

  if (state === "checking") {
    stockMessage.classList.remove("is-hidden");
    stockPill.classList.add("is-checking");
    stockPill.innerHTML = '<span class="checkout-spinner" aria-hidden="true"></span> Checking stock';
    stockMessage.innerHTML = "<strong>Checking today’s batch.</strong><span>Hang tight while we check current availability.</span>";
    submitButton.disabled = true;
    return;
  }

  stockPill.classList.add("is-out");
  stockPill.textContent = "Out of stock";
  stockMessage.classList.add("is-hidden");
  submitButton.disabled = false;
}

function setMobileStockCallout(isVisible) {
  if (!mobileStockCallout) return;
  mobileStockCallout.classList.toggle("is-hidden", !isVisible);
}

function setCheckoutStage(stage) {
  checkoutStage = stage;
  window.clearTimeout(stockTimer);

  if (!(submitButton instanceof HTMLButtonElement) || !stockPill || !stockMessage) return;

  modal?.classList.toggle("is-checking-stock", stage === "checking");
  modal?.classList.toggle("is-preorder-ready", stage === "preorder");
  modal?.classList.toggle("is-confirmed", stage === "confirmation");
  setSummaryCopy(stage);

  if (stage === "checkout") {
    setMobileStockCallout(false);
    stockPill.classList.add("is-hidden");
    stockMessage.classList.add("is-hidden");
    submitButton.disabled = false;
    submitButton.textContent = "Buy now";
    setNote("");
    return;
  }

  if (stage === "confirmation") {
    setMobileStockCallout(false);
    stockPill.classList.add("is-hidden");
    stockMessage.classList.add("is-hidden");
    submitButton.disabled = false;
    setNote("");
    return;
  }

  if (stage === "checking") {
    setMobileStockCallout(false);
    setStockState("checking");
    submitButton.textContent = "Checking stock...";
    setNote("Checking current availability.");
    stockTimer = window.setTimeout(() => {
      setCheckoutStage("preorder");
    }, 1800);
    return;
  }

  setStockState("out");
  setMobileStockCallout(true);
  submitButton.textContent = "Join the pre-order list";
  setNote("No payment needed to join the waitlist.");
}

function getCurrentPickerColour() {
  const selectedSwatch = document.querySelector(".picker-swatch.is-selected");
  const colourKey = selectedSwatch?.getAttribute("data-colour") || "";
  return colourLabels[colourKey] || "Chocolate Brown";
}

function setSelectedColour(colour) {
  if (!(colourSelect instanceof HTMLSelectElement)) return;
  const nextColour = colour || getCurrentPickerColour();
  const hasOption = Array.from(colourSelect.options).some((option) => option.value === nextColour);
  colourSelect.value = hasOption ? nextColour : "Chocolate Brown";
  updateColourSwatch();
}

function focusFirstField() {
  const firstField = form?.querySelector('input[name="first_name"]');
  if (firstField instanceof HTMLInputElement) firstField.focus();
}

function openCheckout(preferredColour = "") {
  if (!modal) return;

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  setSelectedColour(preferredColour);
  setCheckoutStage("checkout");
  updateOrderSummary();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("checkout-is-open");

  const closeButton = modal.querySelector(".checkout-close");
  if (closeButton instanceof HTMLButtonElement) closeButton.focus();
}

function closeCheckout() {
  if (!modal || isSubmitting) return;

  window.clearTimeout(stockTimer);
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("checkout-is-open");
  lastFocusedElement?.focus();
}

function getPayload() {
  if (!(form instanceof HTMLFormElement)) return null;

  const formData = new FormData(form);
  const quantity = Number.parseInt(String(formData.get("quantity") || ""), 10);
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const data = {
    first_name: firstName,
    last_name: lastName,
    email: String(formData.get("email") || "").trim().toLowerCase(),
    quantity,
    colour: cleanOptionalText(formData.get("colour")),
    marketing_consent: formData.has("marketing_consent"),
  };

  return {
    honeypot: String(formData.get("company") || "").trim(),
    data,
  };
}

function validatePayload(payload) {
  if (!payload.first_name) return "Please enter your first name.";
  if (!payload.last_name) return "Please enter your last name.";
  if (!isValidEmail(payload.email)) return "Please enter a valid email address.";
  if (!payload.colour) return "Please choose a colour.";
  if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) return "Please choose a quantity.";
  return "";
}

function isDuplicatePreorderError(error) {
  const message = String(error?.message || "").toLowerCase();
  return error?.code === "23505" || message.includes("duplicate") || message.includes("unique");
}

function getPreorderRecordPayload(payload, action) {
  return {
    client_id: getClientId(),
    first_name: payload?.first_name || null,
    last_name: payload?.last_name || null,
    email: payload?.email || null,
    quantity: payload?.quantity || null,
    colour: payload?.colour || null,
    marketing_consent: payload?.marketing_consent || false,
    action,
  };
}

async function recordPreorderAction(supabase, payload, action) {
  try {
    const { error } = await supabase.from("preorders").insert(getPreorderRecordPayload(payload, action));
    if (error) {
      console.warn("Preorder action was not saved.", { action, code: error.code });
    }
    return error;
  } catch (error) {
    console.warn("Preorder action was not saved.", { action, error });
    return error;
  }
}

async function recordPreorderActionWhenReady(payload, action) {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;
  return recordPreorderAction(supabase, payload, action);
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const preferredColour = trigger.getAttribute("data-checkout-colour") || "";
    recordPreorderActionWhenReady({ colour: preferredColour || getCurrentPickerColour() }, "buy_now_clicked");
    openCheckout(preferredColour);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeCheckout);
});

document.addEventListener("keydown", (event) => {
  if (!modal?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeCheckout();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = Array.from(
    modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')
  ).filter((node) => node instanceof HTMLElement && node.offsetParent !== null);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isSubmitting || checkoutStage === "checking") return;

  const payload = getPayload();
  if (!payload) return;

  const validationError = validatePayload(payload.data);

  if (payload.honeypot) {
    setNote("Thanks - you're on the list. We'll contact you before launch.", "success");
    form.reset();
    setSelectedColour();
    updateOrderSummary();
    return;
  }

  if (validationError) {
    setNote(validationError, "error");
    return;
  }

  if (checkoutStage === "checkout") {
    recordPreorderActionWhenReady(payload.data, "checkout_submitted");
    setCheckoutStage("checking");
    return;
  }

  const supabase = await getSupabaseClient();

  if (!supabase) {
    setNote("The pre-order list is not connected just yet. Please email support@roamboard.shop and we'll add you manually.", "error");
    return;
  }

  setSubmitting(true);
  setNote("");

  try {
    const error = await recordPreorderAction(supabase, payload.data, "preorder_committed");

    if (error) {
      setNote(
        isDuplicatePreorderError(error)
          ? "Looks like you're already on the pre-order list."
          : "We couldn't save your details just now. Please try again or email support@roamboard.shop.",
        isDuplicatePreorderError(error) ? "success" : "error"
      );
      return;
    }

    form.reset();
    setSelectedColour();
    updateOrderSummary();
    setCheckoutStage("confirmation");
  } catch {
    setNote("We couldn't save your details just now. Please try again or email support@roamboard.shop.", "error");
  } finally {
    setSubmitting(false);
  }
});

quantityInput?.addEventListener("input", updateOrderSummary);
colourSelect?.addEventListener("change", updateColourSwatch);
shareButton?.addEventListener("click", copyShareLink);
updateOrderSummary();
updateColourSwatch();

if (new URLSearchParams(window.location.search).get("checkout") === "open") {
  window.setTimeout(() => openCheckout(), 250);
}
