(() => {
  "use strict";
  // Delegated gallery styling is CSS-only, so filtering and JSON rendering remain intact.
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "viewfinder-toggle";
    toggle.textContent = "VIEWFINDER OFF";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-label", "Toggle camera viewfinder overlay");
    const overlay = document.createElement("div");
    overlay.className = "viewfinder-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="vf-grid"></div><div class="vf-focus"></div><div class="vf-top"><span class="vf-rec">● REC</span><span>LUMORA / FRAME</span></div><div class="vf-bottom"><span>ISO 200</span><span>f/2.8</span><span>1/250</span></div>';
    lightbox.append(toggle, overlay);
    toggle.addEventListener("click", () => {
      const on = lightbox.classList.toggle("viewfinder-on");
      toggle.setAttribute("aria-pressed", String(on));
      toggle.textContent = on ? "VIEWFINDER ON" : "VIEWFINDER OFF";
    });
    // Existing ultimate.js has its own Tab trap; extend its list to include the new control.
    // Use capture to intercept Tab before the original listener and include all visible controls.
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Tab" || !lightbox.classList.contains("open")) return;
        const controls = ["lightboxClose", "lightboxPrev", "lightboxNext"]
          .map((id) => document.getElementById(id))
          .filter(Boolean);
        controls.push(toggle);
        const i = controls.indexOf(document.activeElement);
        event.preventDefault();
        event.stopImmediatePropagation();
        controls[
          (i + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
        ].focus();
      },
      true,
    );
  }
  const wall = document.getElementById("polaroidWall");
  if (!wall) return;
  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load photographs");
      return response.json();
    })
    .then((items) => {
      const photos = items.slice(0, 6);
      const positions = [
        [4, 7, -9],
        [36, 4, 7],
        [67, 10, -5],
        [9, 49, 6],
        [39, 47, -7],
        [70, 51, 9],
      ];
      photos.forEach((item, index) => {
        const [x, y, angle] = positions[index];
        const card = document.createElement("figure");
        card.className = "polaroid";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Open " + item.title + " photograph");
        card.style.setProperty("--x", x + "%");
        card.style.setProperty("--y", y + "%");
        card.style.setProperty("--angle", angle + "deg");
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt || item.title;
        img.loading = "lazy";
        img.draggable = false;
        const caption = document.createElement("figcaption");
        caption.textContent = item.title;
        card.append(img, caption);
        wall.append(card);
        card.addEventListener("dblclick", () => showPhoto(item));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            showPhoto(item);
          }
        });
        let drag = null;
        card.addEventListener("pointerdown", (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          const r = wall.getBoundingClientRect(),
            c = card.getBoundingClientRect();
          drag = {
            id: e.pointerId,
            dx: e.clientX - c.left,
            dy: e.clientY - c.top,
          };
          card.setPointerCapture(e.pointerId);
          card.classList.add("dragging");
          card.style.zIndex = "10";
        });
        card.addEventListener("pointermove", (e) => {
          if (!drag || drag.id !== e.pointerId) return;
          const r = wall.getBoundingClientRect();
          const left = Math.max(
            0,
            Math.min(r.width - card.offsetWidth, e.clientX - r.left - drag.dx),
          );
          const top = Math.max(
            0,
            Math.min(r.height - card.offsetHeight, e.clientY - r.top - drag.dy),
          );
          card.style.left = left + "px";
          card.style.top = top + "px";
        });
        const end = () => {
          drag = null;
          card.classList.remove("dragging");
        };
        card.addEventListener("pointerup", end);
        card.addEventListener("pointercancel", end);
      });
    })
    .catch(() => {
      wall.textContent =
        "Could not load photos. Please run with VS Code Live Server.";
    });
  function showPhoto(item) {
    if (!lightbox) return;
    const img = document.getElementById("lightboxImg");
    img.src = item.image;
    img.alt = item.alt || item.title;
    document.getElementById("lightboxTitle").textContent =
      item.title + " · " + item.category;
    // Trigger existing lightbox index/navigation handling.
    document.dispatchEvent(
      new CustomEvent("lumora:lightbox-open", { detail: item }),
    );
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("lightboxClose").focus();
  }
})();
