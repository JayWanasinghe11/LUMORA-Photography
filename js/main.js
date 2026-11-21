const $ = (selector) => document.querySelector(selector);
const nav = $("#navLinks");
const menu = $("#menuToggle");
const theme = $("#themeToggle");
const page = location.pathname.split("/").pop().replace(".html", "") || "index";
document.querySelectorAll("[data-page]").forEach((link) => {
  if (link.dataset.page === page) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});
$("#year").textContent = new Date().getFullYear();
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }),
);
try {
  if (localStorage.getItem("lumora-theme") === "light")
    document.body.classList.add("light");
} catch (e) {}
function updateTheme() {
  theme.textContent = document.body.classList.contains("light") ? "☾" : "☼";
}
updateTheme();
theme.addEventListener("click", () => {
  document.body.classList.toggle("light");
  updateTheme();
  try {
    localStorage.setItem(
      "lumora-theme",
      document.body.classList.contains("light") ? "light" : "dark",
    );
  } catch (e) {}
});
const observer =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          }),
        { threshold: 0.08 },
      )
    : null;
function reveal() {
  document
    .querySelectorAll(".reveal:not(.visible)")
    .forEach((el) =>
      observer ? observer.observe(el) : el.classList.add("visible"),
    );
}
reveal();
let projects = [];
window.lumoraProjects = projects;
window.lumoraCurrentSelection = [];
const gallery = $("#portfolioGallery") || $("#featuredGallery");
function render(category = "All") {
  if (!gallery) return;
  const selection =
    gallery.id === "featuredGallery"
      ? projects.slice(0, 3)
      : projects.filter((p) => category === "All" || p.category === category);
  window.lumoraCurrentSelection = selection;
  gallery.replaceChildren();
  if (!selection.length) {
    gallery.innerHTML = '<p class="empty">No projects found.</p>';
    return;
  }
  selection.forEach((item) => {
    const card = document.createElement("article");
    card.className = "photo-card reveal";
    card.dataset.projectId = item.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "View " + item.title);
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.alt;
    img.loading = "lazy";
    const caption = document.createElement("div");
    caption.className = "photo-caption";
    const cat = document.createElement("span");
    cat.textContent = item.category;
    const h = document.createElement("h3");
    h.textContent = item.title;
    caption.append(cat, h);
    card.append(img, caption);
    card.addEventListener("click", () => openLightbox(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
    gallery.append(card);
  });
  reveal();
  document.dispatchEvent(new Event("lumora:gallery-rendered"));
}
if (gallery) {
  fetch("data/projects.json")
    .then((r) => {
      if (!r.ok) throw Error("Could not load projects");
      return r.json();
    })
    .then((data) => {
      projects = data;
      window.lumoraProjects = projects;
      render();
    })
    .catch(() => {
      gallery.innerHTML =
        '<p class="empty">Could not load the gallery. Run this website through a local server (such as VS Code Live Server or python -m http.server).</p>';
    });
}
document.querySelectorAll("[data-filter]").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    render(btn.dataset.filter);
  }),
);
const lightbox = $("#lightbox");
let previousFocus = null;
function openLightbox(item) {
  window.lumoraActiveItem = item;
  document.dispatchEvent(
    new CustomEvent("lumora:lightbox-open", { detail: item }),
  );
  previousFocus = document.activeElement;
  $("#lightboxImg").src = item.image;
  $("#lightboxImg").alt = item.alt;
  $("#lightboxTitle").textContent = item.title + " · " + item.category;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#lightboxClose").focus();
}
function closeLightbox() {
  document.dispatchEvent(new Event("lumora:lightbox-close"));
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  $("#lightboxImg").removeAttribute("src");
  document.body.style.overflow = "";
  previousFocus?.focus();
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open"))
    closeLightbox();
  if (e.key === "Tab" && lightbox.classList.contains("open")) {
    e.preventDefault();
    $("#lightboxClose").focus();
  }
});
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    let valid = true;
    for (const field of ["name", "email", "subject", "message"]) {
      const value = (values[field] || "").trim();
      let error = value ? "" : "This field is required.";
      if (
        field === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      )
        error = "Enter a valid email address.";
      $("#" + field + "Error").textContent = error;
      $("#" + field).setAttribute("aria-invalid", String(Boolean(error)));
      if (error) valid = false;
    }
    if (!valid) {
      $("#formStatus").textContent = "Please fix the highlighted fields.";
      return;
    }
    const recipient = "hello@lumora.example";
    const subject = encodeURIComponent(values.subject.trim());
    const body = encodeURIComponent(
      "Name: " +
        values.name.trim() +
        "\nEmail: " +
        values.email.trim() +
        "\n\n" +
        values.message.trim(),
    );
    $("#formStatus").textContent =
      "Your email application will open now. Please press Send there to deliver your message.";
    window.location.href =
      "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
  });
}

// Cinematic intro: accessible and safe fallback when assets load slowly.
const intro = document.getElementById("siteLoader");
if (intro) {
  const finishIntro = () => {
    intro.classList.add("is-done");
    setTimeout(() => intro.remove(), 750);
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishIntro();
  } else {
    setTimeout(finishIntro, 1550);
  }
}
// Three-frame cinematic slider, with manual navigation and pause control.
const heroSlides = [...document.querySelectorAll(".hero-slide")];
if (heroSlides.length) {
  let currentSlide = 0;
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counter = document.getElementById("slideCounter");
  const pauseBtn = document.getElementById("slidePause");
  function showSlide(n) {
    currentSlide = (n + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === currentSlide),
    );
    counter.textContent =
      String(currentSlide + 1).padStart(2, "0") +
      " / " +
      String(heroSlides.length).padStart(2, "0");
  }
  document
    .getElementById("slidePrev")
    .addEventListener("click", () => showSlide(currentSlide - 1));
  document
    .getElementById("slideNext")
    .addEventListener("click", () => showSlide(currentSlide + 1));
  function updatePause() {
    pauseBtn.textContent = paused ? "▶" : "Ⅱ";
    pauseBtn.setAttribute(
      "aria-label",
      paused ? "Play slideshow" : "Pause slideshow",
    );
    pauseBtn.setAttribute("aria-pressed", String(paused));
  }
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    updatePause();
  });
  updatePause();
  setInterval(() => {
    if (!paused && !document.hidden) showSlide(currentSlide + 1);
  }, 5500);
}
// Internal page transitions, preserving browser controls and modified clicks.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll('a[href$=".html"]').forEach((link) =>
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target ||
        link.hasAttribute("download")
      )
        return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname === location.pathname)
        return;
      event.preventDefault();
      document.body.classList.add("page-exit");
      setTimeout(() => {
        location.href = url.href;
      }, 340);
    }),
  );
}
