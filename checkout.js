const modal = document.querySelector("[data-checkout-modal]");
const form = document.querySelector("[data-checkout-form]");
const colourSelect = document.querySelector("select[data-checkout-colour]");
const stockPill = document.querySelector("[data-stock-pill]");
const stockMessage = document.querySelector("[data-stock-message]");
const submitButton = document.querySelector("[data-checkout-submit]");
const note = document.querySelector("[data-checkout-note]");
const checkoutKicker = document.querySelector(".checkout-kicker");
const checkoutTitle = document.querySelector("#checkout-title");
const checkoutDescription = document.querySelector("#checkout-description");
const closeButtons = Array.from(document.querySelectorAll("[data-checkout-close]"));
const triggers = Array.from(document.querySelectorAll("[data-checkout-trigger]"));

const PRODUCT_PRICE = "Euro Summer promotion A$69.95 A$54.95";
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

let lastFocusedElement = null;
let stockTimer = null;
let isSubmitting = false;
let supabaseClient = null;
let checkoutStage = "checkout";

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const config = window.ROAMBOARD_SUPABASE_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanOptionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function isMissingColumnError(error) {
  const message = String(error?.message || "").toLowerCase();
  return error?.code === "PGRST204" || error?.code === "42703" || message.includes("column") || message.includes("schema cache");
}

function setNote(message, status = "") {
  if (!note) return;
  note.textContent = message;
  note.classList.toggle("is-success", status === "success");
  note.classList.toggle("is-error", status === "error");
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

function setCheckoutStage(stage) {
  checkoutStage = stage;
  window.clearTimeout(stockTimer);

  if (!(submitButton instanceof HTMLButtonElement) || !stockPill || !stockMessage) return;

  modal?.classList.toggle("is-checking-stock", stage === "checking");
  modal?.classList.toggle("is-preorder-ready", stage === "preorder");
  modal?.classList.toggle("is-confirmed", stage === "confirmation");
  setSummaryCopy(stage);

  if (stage === "checkout") {
    stockPill.classList.add("is-hidden");
    stockMessage.classList.add("is-hidden");
    submitButton.disabled = false;
    submitButton.textContent = "Buy now";
    setNote("");
    return;
  }

  if (stage === "confirmation") {
    stockPill.classList.add("is-hidden");
    stockMessage.classList.add("is-hidden");
    submitButton.disabled = false;
    setNote("");
    return;
  }

  if (stage === "checking") {
    setStockState("checking");
    submitButton.textContent = "Checking stock...";
    setNote("Checking current availability.");
    stockTimer = window.setTimeout(() => {
      setCheckoutStage("preorder");
    }, 1800);
    return;
  }

  setStockState("out");
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
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const data = {
    first_name: firstName,
    last_name: lastName,
    name: fullName,
    email: String(formData.get("email") || "").trim().toLowerCase(),
    quantity,
    colour: cleanOptionalText(formData.get("colour")),
    variant: PRODUCT_PRICE,
    notes: cleanOptionalText(formData.get("notes")),
    marketing_consent: formData.has("marketing_consent"),
    source: "checkout_modal",
    status: "registered_interest",
  };

  return {
    honeypot: String(formData.get("company") || "").trim(),
    data,
    legacyData: {
      name: fullName,
      email: data.email,
      quantity: data.quantity,
      colour: data.colour,
      variant: data.variant,
      notes: data.notes,
      marketing_consent: data.marketing_consent,
      source: data.source,
      status: data.status,
    },
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

triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const preferredColour = trigger.getAttribute("data-checkout-colour") || "";
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
    return;
  }

  if (validationError) {
    setNote(validationError, "error");
    return;
  }

  if (checkoutStage === "checkout") {
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
    let { error } = await supabase.from("preorders").insert(payload.data);

    if (error && isMissingColumnError(error)) {
      ({ error } = await supabase.from("preorders").insert(payload.legacyData));
    }

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
    setCheckoutStage("confirmation");
  } catch {
    setNote("We couldn't save your details just now. Please try again or email support@roamboard.shop.", "error");
  } finally {
    setSubmitting(false);
  }
});

if (new URLSearchParams(window.location.search).get("checkout") === "open") {
  window.setTimeout(() => openCheckout(), 250);
}
