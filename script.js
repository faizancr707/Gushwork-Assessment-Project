const carouselItems = [
  {
    src: "assets/carousel-research.svg",
    alt: "Research queue with qualified leads and account notes",
    kicker: "Step 01",
    title: "Lead research queue",
    caption: "Verified accounts are grouped by segment and buying signal.",
  },
  {
    src: "assets/carousel-enrichment.svg",
    alt: "Data enrichment screen with firmographic and contact fields",
    kicker: "Step 02",
    title: "Data enrichment",
    caption: "Operators review AI-filled fields before records enter the CRM.",
  },
  {
    src: "assets/carousel-outreach.svg",
    alt: "Outreach preparation board with personalized email drafts",
    kicker: "Step 03",
    title: "Outreach prep",
    caption: "Personalized drafts are staged with context, proof points, and next actions.",
  },
  {
    src: "assets/carousel-reporting.svg",
    alt: "Reporting dashboard with campaign metrics and task completion trends",
    kicker: "Step 04",
    title: "Live reporting",
    caption: "Weekly progress stays visible through concise metrics and delivery notes.",
  },
];

const stickyHeader = document.querySelector("[data-sticky-header]");
const hero = document.querySelector(".hero");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("[data-nav-menu]");
const carousel = document.querySelector("[data-carousel]");

let activeIndex = 0;

// Reveal the announcement only after the hero/first fold, then offset the nav below it.
function updateStickyHeader() {
  if (!stickyHeader || !hero) return;

  const triggerPoint = hero.offsetTop + hero.offsetHeight * 0.82;
  const shouldShow = window.scrollY > triggerPoint;

  stickyHeader.classList.toggle("is-visible", shouldShow);
  document.documentElement.classList.toggle("has-sticky-banner", shouldShow);
}

function setupNavigation() {
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
  });

  navMenu.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    menuToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  });
}

function setupCarousel() {
  if (!carousel) return;

  const mainImage = carousel.querySelector("[data-carousel-image]");
  const zoomImage = carousel.querySelector("[data-zoom-image]");
  const title = carousel.querySelector("[data-carousel-title]");
  const kicker = carousel.querySelector("[data-carousel-kicker]");
  const caption = carousel.querySelector("[data-carousel-caption]");
  const zoomSource = carousel.querySelector("[data-zoom-source]");
  const zoomPreview = carousel.querySelector("[data-zoom-preview]");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const thumbnails = [...carousel.querySelectorAll("[data-carousel-thumb]")];

  // Keep the main image, zoom preview, caption, and thumbnail state in sync.
  function setActiveItem(nextIndex) {
    activeIndex = (nextIndex + carouselItems.length) % carouselItems.length;
    const item = carouselItems[activeIndex];

    mainImage.src = item.src;
    mainImage.alt = item.alt;
    zoomImage.src = item.src;
    title.textContent = item.title;
    kicker.textContent = item.kicker;
    caption.textContent = item.caption;

    thumbnails.forEach((thumbnail, index) => {
      const isActive = index === activeIndex;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-selected", String(isActive));
    });
  }

  function showZoom() {
    zoomPreview.classList.add("is-active");
  }

  function hideZoom() {
    zoomPreview.classList.remove("is-active");
  }

  previousButton.addEventListener("click", () => setActiveItem(activeIndex - 1));
  nextButton.addEventListener("click", () => setActiveItem(activeIndex + 1));

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      setActiveItem(Number(thumbnail.dataset.index));
    });
  });

  // Hover/focus handles desktop accessibility; click gives touch devices a usable fallback.
  zoomSource.addEventListener("mouseenter", showZoom);
  zoomSource.addEventListener("mouseleave", hideZoom);
  zoomSource.addEventListener("focus", showZoom);
  zoomSource.addEventListener("blur", hideZoom);
  zoomSource.addEventListener("click", () => {
    zoomPreview.classList.toggle("is-active");
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveItem(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveItem(activeIndex + 1);
    }

    if (event.key === "Escape") {
      hideZoom();
    }
  });

  setActiveItem(activeIndex);
}

window.addEventListener("scroll", updateStickyHeader, { passive: true });
window.addEventListener("resize", updateStickyHeader);
window.addEventListener("load", updateStickyHeader);

setupNavigation();
setupCarousel();
