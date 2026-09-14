# NSS SLIET Longowal Website

Modern static website for National Service Scheme (NSS), Sant Longowal Institute of Engineering and Technology.

## Pages
- Home — `index.html`
- About NSS — `about.html`
- Activities — `activities.html`
- Projects — `projects.html`
- Events & Stories — `events.html`
- Gallery — `gallery.html`
- Team — `team.html`
- Volunteer profile card — `volunteer.html`
- Contact / Join — `contact.html`

## Structure
```text
NSS/
├── index.html
├── about.html
├── activities.html
├── projects.html
├── events.html
├── gallery.html
├── team.html
├── contact.html
├── styles.css
├── script.js
├── .nojekyll
└── assets/
    └── logo.svg
```

## GitHub Pages
In GitHub: **Settings → Pages → Deploy from a branch → main → / (root) → Save**.

The site uses only HTML, CSS and JavaScript, so no build step is required.

Content is based on publicly available SLIET NSS information; verify current office-bearer details before publishing official contact information.

## Volunteer profile card

The volunteer profile page deliberately stores data only in the visitor's browser (`localStorage`) and marks each card as self-generated and verification pending. It is not an official NSS ID card and does not submit registrations. A real institute-wide registration system needs an NSS-approved backend, authentication and a privacy policy before collecting volunteer data.
