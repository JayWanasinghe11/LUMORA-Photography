"use strict";
// LUMORA Ultimate: enhancements remain optional on pages without the corresponding elements.
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = document.getElementById("customCursor");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (cursor && finePointer.matches && !reduced.matches) {
    let px = -100,
      py = -100,
      tx = -100,
      ty = -100;
    document.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType === "mouse") {
          tx = e.clientX;
          ty = e.clientY;
        }
      },
      { passive: true },
    );
    function animateCursor() {
      px += (tx - px) * 0.22;
      py += (ty - py) * 0.22;
      cursor.style.transform = `translate3d(${px - (cursor.classList.contains("is-view") ? 36 : 11)}px,${py - (cursor.classList.contains("is-view") ? 36 : 11)}px,0)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
    document.addEventListener("pointerover", (e) =>
      cursor.classList.toggle(
        "is-view",
        Boolean(e.target.closest(".photo-card")),
      ),
    );
    document.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget) cursor.classList.remove("is-view");
    });
  }
  // Dynamically generated gallery cards: delegated mouse tilt, reset when leaving.
  document.addEventListener(
    "pointermove",
    (e) => {
      if (reduced.matches || e.pointerType !== "mouse") return;
      const card = e.target.closest(".photo-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty(
        "--tilt-y",
        ((e.clientX - r.left) / r.width - 0.5) * 8 + "deg",
      );
      card.style.setProperty(
        "--tilt-x",
        (0.5 - (e.clientY - r.top) / r.height) * 8 + "deg",
      );
    },
    { passive: true },
  );
  document.addEventListener("pointerout", (e) => {
    const card = e.target.closest(".photo-card");
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }
  });
  const revealText = document.querySelectorAll(
    ".page-hero h1,.section-heading h2,.cta h2,.about-copy h2",
  );
  revealText.forEach((el) => el.classList.add("text-reveal"));
  if (!reduced.matches && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-shown");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".text-reveal").forEach((el) => obs.observe(el));
  } else
    document
      .querySelectorAll(".text-reveal")
      .forEach((el) => el.classList.add("is-shown"));
  const parallax = document.querySelectorAll(".parallax-image");
  if (parallax.length && !reduced.matches) {
    let scheduled = false;
    const tick = () => {
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          const y = (innerHeight / 2 - (r.top + r.height / 2)) * 0.065;
          el.style.setProperty(
            "--parallax-y",
            Math.max(-20, Math.min(20, y)) + "px",
          );
        }
      });
      scheduled = false;
    };
    addEventListener(
      "scroll",
      () => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(tick);
        }
      },
      { passive: true },
    );
    tick();
  }
  // Comparison uses a native range input: keyboard arrows and touch supported.
  const compare = document.getElementById("beforeAfter");
  const range = document.getElementById("compareRange");
  if (compare && range) {
    const update = () =>
      compare.style.setProperty("--split", range.value + "%");
    range.addEventListener("input", update);
    update();
  }
  // Animate fictional studio statistics once when visible.
  const counts = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const end = Number(el.dataset.count),
      suffix = el.dataset.suffix || "";
    if (reduced.matches) {
      el.textContent = end + suffix;
      return;
    }
    const start = performance.now();
    const duration = 1400;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCount(e.target);
          obs.unobserve(e.target);
        }
      }),
    );
    counts.forEach((el) => obs.observe(el));
  } else counts.forEach(runCount);
  // Lightbox navigation respects the currently selected gallery filter.
  const box = document.getElementById("lightbox");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  const count = document.getElementById("lightboxCount");
  let index = 0;
  let current = [];
  function updateLightbox() {
    if (!current.length) return;
    const item = current[index];
    const img = document.getElementById("lightboxImg");
    img.src = item.image;
    img.alt = item.alt || item.title;
    document.getElementById("lightboxTitle").textContent =
      item.title + " · " + item.category;
    count.textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(current.length).padStart(2, "0");
  }
  document.addEventListener("lumora:lightbox-open", (e) => {
    current = window.lumoraCurrentSelection || [];
    index = current.findIndex((p) => p.id === e.detail.id);
    if (index < 0) {
      current = [e.detail];
      index = 0;
    }
    updateLightbox();
  });
  const move = (step) => {
    if (!box?.classList.contains("open") || !current.length) return;
    index = (index + step + current.length) % current.length;
    updateLightbox();
  };
  prev?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  document.addEventListener("keydown", (e) => {
    if (!box?.classList.contains("open")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    }
    if (e.key === "Tab") {
      const controls = [document.getElementById("lightboxClose"), prev, next];
      const pos = controls.indexOf(document.activeElement);
      e.preventDefault();
      controls[
        (pos + (e.shiftKey ? -1 : 1) + controls.length) % controls.length
      ].focus();
    }
  });
})();
