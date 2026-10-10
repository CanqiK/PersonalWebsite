# CANQI 燦琪 — Personal Website

Personal portfolio of Canqi Lin / 林灿琪. This repository contains a static HTML wireframe for the public site.

**Website:** [canqik.github.io/PersonalWebsite](https://canqik.github.io/PersonalWebsite/)

The current release is an interactive draft. Its artwork is procedural layout imagery labelled as a placeholder. Project documentation, CV entries, and contact details are incomplete and must be checked before being presented as final content.

## Explore

```text
Landing → Main
  ├─ As an artist → Works → Project details
  ├─ As a mentor → Section in progress
  └─ Who am I?
       ├─ About
       ├─ CV
       └─ Have you seen Canqi? (Contact)
```

The site starts in English and offers a Chinese switch. The work index has six selected titles, category filters, and square halftone studies. Print settings allow the reader to compare halftone, grayscale, dot size, and grain. Motion respects `prefers-reduced-motion`.

## Run locally

Open `index.html`, or serve this directory with:

```sh
python -m http.server 4173
```

Then visit `http://localhost:4173/`. No dependencies or build step are required. Routes use URL fragments such as `#works`, so deep links work under a GitHub Pages project path.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, primary and secondary navigation, print controls |
| `styles.css` | Editorial layout, print texture, responsive styles |
| `app.js` | Routes, bilingual copy, project index, filters, Canvas halftone |
| `.nojekyll` | Keeps GitHub Pages from applying Jekyll processing |
| `docs/CONTENT.md` | What is verified, provisional, and still missing |
| `docs/PUBLISHING.md` | Deployment and maintenance instructions |

## Editing

- Page text and project data are in `app.js`; keep English and Chinese variants together.
- Visual layout and breakpoints are in `styles.css`.
- Replace `data-study` canvases with authorized images when project media is ready. Keep actual work colors on detail pages; use print effects selectively.
- Update `docs/CONTENT.md` as facts, permissions, and credits are confirmed.

This repository is the public site source. Do not commit original portfolios, private correspondence, application materials, raw media, or credentials.
