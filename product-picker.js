const picker = document.querySelector("[data-picker]");

const views = ["detail", "top", "angle"];
const colours = {
  brown: {
    label: "Chocolate Brown",
    accent: "#725849",
    views: {
      detail: {
        src: "assets/optimized/picker-brown-detail-1020w.webp",
        srcset: "assets/optimized/picker-brown-detail-1020w.webp 1020w, assets/optimized/picker-brown-detail-2040w.webp 2040w",
        alt: "Chocolate Brown Roamboard close detail view",
      },
      top: {
        src: "assets/optimized/picker-brown-top-1020w.webp",
        srcset: "assets/optimized/picker-brown-top-1020w.webp 1020w, assets/optimized/picker-brown-top-2040w.webp 2040w",
        alt: "Chocolate Brown Roamboard top view with braided cable",
      },
      angle: {
        src: "assets/optimized/picker-brown-angle-1020w.webp",
        srcset: "assets/optimized/picker-brown-angle-1020w.webp 1020w, assets/optimized/picker-brown-angle-2040w.webp 2040w",
        alt: "Chocolate Brown Roamboard angled view",
      },
    },
  },
  blue: {
    label: "Baby Blue",
    accent: "#6b88a9",
    views: {
      detail: {
        src: "assets/optimized/picker-blue-detail-1020w.webp",
        srcset: "assets/optimized/picker-blue-detail-1020w.webp 1020w, assets/optimized/picker-blue-detail-2040w.webp 2040w",
        alt: "Baby Blue Roamboard close detail view",
      },
      top: {
        src: "assets/optimized/picker-blue-top-1020w.webp",
        srcset: "assets/optimized/picker-blue-top-1020w.webp 1020w, assets/optimized/picker-blue-top-2040w.webp 2040w",
        alt: "Baby Blue Roamboard top view with braided cable",
      },
      angle: {
        src: "assets/optimized/picker-blue-angle-1020w.webp",
        srcset: "assets/optimized/picker-blue-angle-1020w.webp 1020w, assets/optimized/picker-blue-angle-2040w.webp 2040w",
        alt: "Baby Blue Roamboard angled view",
      },
    },
  },
  orange: {
    label: "Cosmic Orange",
    accent: "#f35e2d",
    views: {
      detail: {
        src: "assets/optimized/picker-orange-detail-1020w.webp",
        srcset: "assets/optimized/picker-orange-detail-1020w.webp 1020w, assets/optimized/picker-orange-detail-2040w.webp 2040w",
        alt: "Cosmic Orange Roamboard close detail view",
      },
      top: {
        src: "assets/optimized/picker-orange-top-1020w.webp",
        srcset: "assets/optimized/picker-orange-top-1020w.webp 1020w, assets/optimized/picker-orange-top-2040w.webp 2040w",
        alt: "Cosmic Orange Roamboard top view with braided cable",
      },
      angle: {
        src: "assets/optimized/picker-orange-angle-1020w.webp",
        srcset: "assets/optimized/picker-orange-angle-1020w.webp 1020w, assets/optimized/picker-orange-angle-2040w.webp 2040w",
        alt: "Cosmic Orange Roamboard angled view",
      },
    },
  },
};

if (picker) {
  const image = picker.querySelector("[data-picker-image]");
  const title = picker.querySelector("[data-picker-title]");
  const subtitle = picker.querySelector("[data-picker-subtitle]");
  const swatches = Array.from(picker.querySelectorAll("[data-colour]"));
  const arrows = Array.from(picker.querySelectorAll("[data-view-direction]"));
  let selectedColour = "brown";
  let selectedViewIndex = 0;
  let swapTimer = null;

  Object.values(colours).forEach((colour) => {
    Object.values(colour.views).forEach((view) => {
      const preload = new Image();
      preload.src = view.src;
      preload.srcset = view.srcset;
      preload.sizes = "(max-width: 900px) calc(100vw - 36px), 1020px";
    });
  });

  function viewData() {
    return colours[selectedColour].views[views[selectedViewIndex]];
  }

  function updateCopy() {
    const colour = colours[selectedColour];
    title.style.color = colour.accent;
    subtitle.textContent = `Shown in ${colour.label}.`;
  }

  function setImage(direction = 1) {
    const data = viewData();
    window.clearTimeout(swapTimer);
    image.style.setProperty("--picker-slide", direction >= 0 ? "18px" : "-18px");
    image.classList.add("is-changing");

    swapTimer = window.setTimeout(() => {
      image.src = data.src;
      image.srcset = data.srcset;
      image.alt = data.alt;
      image.onload = () => image.classList.remove("is-changing");
      if (image.complete) image.classList.remove("is-changing");
    }, 180);
  }

  function setColour(colour) {
    if (!colours[colour] || colour === selectedColour) return;
    selectedColour = colour;
    swatches.forEach((swatch) => {
      const isSelected = swatch.dataset.colour === selectedColour;
      swatch.classList.toggle("is-selected", isSelected);
      swatch.setAttribute("aria-pressed", String(isSelected));
    });
    updateCopy();
    setImage(1);
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => setColour(swatch.dataset.colour));
  });

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const direction = arrow.dataset.viewDirection === "next" ? 1 : -1;
      selectedViewIndex = (selectedViewIndex + direction + views.length) % views.length;
      setImage(direction);
    });
  });

  updateCopy();
}
