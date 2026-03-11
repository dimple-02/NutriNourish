const THEME_STORAGE_KEY = "nutriNourishTheme";
const root = document.documentElement;

function getSavedTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return null;
}

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
}

function createThemeToggleButton() {
  const navInner = document.querySelector(".top-nav__inner");
  if (!navInner || navInner.querySelector("[data-theme-toggle]")) {
    return null;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.setAttribute("data-theme-toggle", "true");

  const icon = document.createElement("span");
  icon.className = "theme-toggle__icon";
  icon.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "theme-toggle__text";

  button.append(icon, text);

  const navButton = document.querySelector("[data-nav-toggle]");
  if (navButton) {
    navInner.insertBefore(button, navButton);
  } else {
    navInner.appendChild(button);
  }

  return button;
}

function updateThemeToggleLabel(button, theme) {
  if (!button) {
    return;
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  const iconNode = button.querySelector(".theme-toggle__icon");
  const textNode = button.querySelector(".theme-toggle__text");

  if (iconNode) {
    iconNode.textContent = nextTheme === "dark" ? "🌙" : "☀️";
  }
  if (textNode) {
    textNode.textContent = nextTheme === "dark" ? "Dark" : "Light";
  }

  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  button.setAttribute("title", `Switch to ${nextTheme} mode`);
}

function initializeThemeToggle() {
  const activeTheme = getSavedTheme() || getPreferredTheme();
  applyTheme(activeTheme);

  const toggleButton = createThemeToggleButton();
  updateThemeToggleLabel(toggleButton, activeTheme);

  if (!toggleButton) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateThemeToggleLabel(toggleButton, nextTheme);
  });
}

initializeThemeToggle();

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const yearNodes = document.querySelectorAll("[data-year]");
yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
