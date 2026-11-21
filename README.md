# LUMORA Photography — Interactive Web Portfolio

A responsive, three-page portfolio for **Alex Morgan**, a fictional photographer. Built for an 8-member HTML/CSS/JavaScript group assignment.

## Pages

- `index.html` — cinematic hero, featured work, studio introduction and call to action.
- `portfolio.html` — dynamically rendered JSON gallery, category filters and keyboard-accessible lightbox.
- `contact.html` — client-side validated contact form that opens an email draft.

## Features

Semantic HTML5, responsive CSS Grid/Flexbox, hover transitions and scroll reveal, mobile hamburger navigation, persistent light/dark toggle, fetch from `data/projects.json`, filters, modal image preview, and accessible form validation.

## Run locally

1. Open the project folder in VS Code.
2. Use the **Live Server** extension and choose **Open with Live Server** on `index.html`.
3. Alternatively, in the project folder run `python -m http.server 8000`, then visit `http://localhost:8000`.
4. Do **not** open the HTML directly with `file://` because browsers may block JSON fetch.

## Deploy on GitHub Pages

Push the **contents** of this project folder to the repository root, then go to **Settings → Pages → Deploy from a branch → main / root**. The site uses relative paths compatible with project Pages sites.

## Project structure

LUMORA-Photography/
├── index.html
├── portfolio.html
├── contact.html
├── css/
├── js/
├── data/
├── images/
├── screenshots/
│ ├── home.png
│ ├── portfolio.png
│ ├── contact.png
│ └── mobile.png
└── README.md

## Academic information

- **Module:** ITM 12022 – Business Applications
- **Group:** 03
- **Lecturer:** [Lecturer's Name]



## Testing checklist

- [ ] Desktop, tablet, mobile viewport
- [ ] Navigation and hamburger menu
- [ ] All gallery filters and photo previews
- [ ] Escape closes lightbox; keyboard Enter opens photos
- [ ] Theme toggle persists after refresh
- [ ] Form required fields and invalid email
- [ ] Email app opens after valid submission
- [ ] Gallery loads via HTTP server
- [ ] Chrome, Firefox and Edge

## Important notes

- **Fictional content:** Photographer identity, achievements, and contact email are demonstration placeholders.
- **Contact form:** Client-side validation works, but this static site **does not send/store messages on a server**. A valid form opens the user's configured email app. Replace `hello@lumora.example` in `contact.html` and `js/main.js` with a real email address before demonstration. For automatic delivery without an email app, integrate a form backend (e.g., Formspree) and test it.
- **Photos:** Images load from Unsplash URLs and require an internet connection. They are not bundled offline. Check photo licensing/attribution requirements before public release.
- **Fonts:** Google Fonts require internet; system fallbacks are provided.

## Suggested 10-minute presentation

0–1 min: concept and team; 1–3 min: HTML pages; 3–5 min: CSS/responsiveness; 5–7 min: JavaScript gallery and modal; 7–8 min: form validation; 8–9 min: live mobile demo; 9–10 min: testing and conclusion.

## Cinematic animation upgrade

- Branded animated intro loader (automatically dismisses after ~1.5 seconds).
- Three-photo cinematic hero slideshow on the home page, automatic rotation every 5.5 seconds, previous/next and pause/play controls.
- Smooth internal page transitions and enhanced gallery hover motion.
- Respects `prefers-reduced-motion` for accessibility.
- All slideshow photos are loaded from Unsplash and require an internet connection.

## Ultimate Cinematic Edition

- Gold custom cursor (desktop mouse only), dynamic photo tilt and hover shine.
- Subtle parallax on the about photograph and intersection-based heading reveals.
- CSS masonry layout on Portfolio, preserving category filters and JSON rendering.
- Lightbox arrows, Left/Right keyboard navigation and a counter within filtered results.
- Before/after comparison on Home using the same photo with CSS color grading (demonstration, not two different source files).
- Animated fictional studio statistics with reduced-motion support.

Open with **VS Code Live Server**; opening HTML with `file://` blocks JSON fetch in most browsers. Photography images and Google Fonts need internet access. Contact uses a fictional email address and mailto, not a backend.

## Creative Studio add-ons

- Gallery images become black-and-white and reveal color on hover/focus (mobile retains color).
- Camera viewfinder toggle in lightbox: simulated overlay, not actual camera metadata.
- Polaroid Wall on Portfolio: drag to rearrange; double-click or keyboard Enter to preview.
- New files: js/creative.js; styles appended to css/style.css. Run through Live Server to fetch data/projects.json.

## Branding update

The project is branded **LUMORA Photography** throughout its pages, loading screen, footer, scripts, and documentation. The contact address `hello@lumora.example` is a fictional placeholder and must be replaced with a real address before public use.

## Additional creative interactions

- Before/after image treatment slider and camera-style viewfinder overlay.
- Black-and-white to color hover reveal and draggable Polaroid wall.
- Enhanced gallery lightbox, subtle tilt effects, animated statistics and motion effects.

