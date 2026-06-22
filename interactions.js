const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const reduceMotion = motionQuery.matches;
function readStoredTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    return;
  }
}

const savedTheme = readStoredTheme();
const initialTheme = savedTheme === "light" ? "light" : "dark";

document.documentElement.classList.add("has-interactions");
document.documentElement.classList.toggle("motion-reduced", reduceMotion);
document.documentElement.dataset.theme = initialTheme;

const themeToggle = document.createElement("button");
themeToggle.className = "theme-toggle";
themeToggle.type = "button";
themeToggle.setAttribute("aria-label", "Changer de theme");
document.body.append(themeToggle);

function updateThemeToggleLabel() {
  const currentTheme = document.documentElement.dataset.theme;
  themeToggle.textContent = currentTheme === "dark" ? "Theme clair" : "Theme sombre";
  themeToggle.setAttribute("aria-pressed", String(currentTheme === "light"));
}

updateThemeToggleLabel();

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  storeTheme(nextTheme);
  updateThemeToggleLabel();
});

const progress = document.createElement("div");
progress.className = "scroll-progress";
progress.setAttribute("aria-hidden", "true");
document.body.append(progress);

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  const clampedRatio = Math.min(1, Math.max(0, ratio));
  progress.style.transform = `scaleX(${clampedRatio})`;
  document.documentElement.style.setProperty("--page-progress", clampedRatio.toFixed(4));
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    history.pushState(null, "", link.getAttribute("href"));
  });
});

const revealSelectors = [
  ".section-heading",
  ".rich-text",
  ".profile-panel",
  ".check-list li",
  ".detail-list li",
  ".folio-grid a",
  ".competence-card",
  ".fact-list div",
  ".evidence-list div",
  ".ac-intro",
  ".ac-row",
  ".project-index",
  ".project-detail",
  ".project-cover > div:first-child",
  ".project-facts div",
  ".project-content > section",
  ".project-content > section > p",
  ".project-content > section > h4",
  ".summary-board article",
  ".final-grid > *",
  ".contact-section > *",
  ".proof-card",
  ".dense-grid > div",
  ".validation-grid > div",
  ".flow-diagram span",
];

const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];
const staggerGroups = [
  { container: ".folio-grid", items: "a", step: 80 },
  { container: ".competence-map", items: ".competence-card", step: 90 },
  { container: ".ac-table", items: ".ac-row", step: 55 },
  { container: ".proof-gallery", items: ".proof-card", step: 95 },
  { container: ".dense-grid", items: "div", step: 80 },
  { container: ".validation-grid", items: "div", step: 70 },
  { container: ".summary-board", items: "article", step: 90 },
  { container: ".flow-diagram", items: "span", step: 80 },
  { container: ".fact-list", items: "div", step: 70 },
  { container: ".evidence-list", items: "div", step: 65 },
  { container: ".project-facts", items: "div", step: 70 },
  { container: ".project-content > section", items: "h4, p, .detail-list li, .dense-grid > div, .validation-grid > div, .flow-diagram span", step: 70 },
  { container: ".check-list", items: "li", step: 65 },
  { container: ".detail-list", items: "li", step: 65 },
];

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 45}ms`);

  if (item.matches(".section-heading, .project-cover > div:first-child")) {
    item.classList.add("reveal-left");
  }

  if (item.matches(".ac-row, .fact-list div, .evidence-list div, .project-facts div")) {
    item.classList.add("reveal-right");
  }

  if (item.matches(".proof-card, .competence-card, .summary-board article, .folio-grid a")) {
    item.classList.add("reveal-zoom");
  }
});

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {

  staggerGroups.forEach(({ container, items, step }) => {
    document.querySelectorAll(container).forEach((group) => {
      group.querySelectorAll(items).forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index, 8) * step}ms`);
        item.style.setProperty("--reveal-distance", `${Math.max(34, 82 - index * 3)}px`);
      });
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [...document.querySelectorAll(".nav a")];
const projectLinks = [...document.querySelectorAll(".project-index a")];
const trackedLinks = [...sectionLinks, ...projectLinks];

function setActiveLink(links, activeId) {
  links.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getHeaderOffset() {
  const header = document.querySelector(".site-header");
  return header ? header.getBoundingClientRect().height : 0;
}

function getProjectActivationLine() {
  const index = document.querySelector(".project-index");

  if (!index) {
    return getHeaderOffset() + 24;
  }

  const rect = index.getBoundingClientRect();
  const isSticky = getComputedStyle(index).position === "sticky" && rect.top <= getHeaderOffset() + 2;
  return isSticky ? rect.bottom + 40 : getHeaderOffset() + 32;
}

function updateActiveLink() {
  const sectionLine = getHeaderOffset() + 32;
  let activeSection = null;

  sectionLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target && target.getBoundingClientRect().top <= sectionLine) {
      activeSection = target.id;
    }
  });

  if (activeSection) {
    setActiveLink(sectionLinks, activeSection);
  }

  const projectLine = getProjectActivationLine();
  const projectsSection = document.querySelector("#projets");
  let activeProject = null;

  if (projectsSection) {
    const projectsRect = projectsSection.getBoundingClientRect();
    const isInsideProjects = projectsRect.top <= projectLine && projectsRect.bottom > projectLine;

    if (isInsideProjects) {
      projectLinks.forEach((link) => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target && target.getBoundingClientRect().top <= projectLine) {
          activeProject = target.id;
        }
      });
    }
  }

  if (activeProject) {
    setActiveLink(projectLinks, activeProject);
  } else {
    setActiveLink(projectLinks, null);
  }
}

updateActiveLink();
window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.hidden = true;
lightbox.innerHTML = `
  <button class="lightbox-close" type="button">Fermer</button>
  <figure class="lightbox-frame">
    <img alt="" />
    <figcaption></figcaption>
  </figure>
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxClose = lightbox.querySelector(".lightbox-close");
let lastFocusedElement = null;

function openLightbox(card) {
  const image = card.querySelector("img");
  const caption = card.querySelector("figcaption");

  if (!image) {
    return;
  }

  lastFocusedElement = document.activeElement;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.innerHTML = caption ? caption.innerHTML : "";
  lightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("is-lightbox-open");
  lightboxImage.removeAttribute("src");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll(".proof-card").forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Agrandir cette preuve visuelle");
  card.addEventListener("click", () => openLightbox(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(card);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
