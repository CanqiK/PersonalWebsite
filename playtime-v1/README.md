# CANQI — Portfolio

Current public runtime, updated 21 November 2026.

- Website: https://canqik.github.io/PersonalWebsite/
- Entrance: https://canqik.github.io/PersonalWebsite/playtime-v1/entrance-prototype/
- Main page: https://canqik.github.io/PersonalWebsite/playtime-v1/site/index.html#main

The established `playtime-v1` URL is kept as the current preview address.
Earlier versions remain recoverable through Git history and the original version tag.

## Current version

An interactive low-poly office entrance with synthesized sound, bubble hit feedback,
character-only pixel/glitch effects, and a surveillance-to-poster transition into
the portfolio. The homepage is a responsive low-poly investigation room with layered parallax,
window rain, a perspective-mapped CRT emblem and desktop photographs. Project readers
contain bilingual descriptions, selected documentation, image galleries and linked
videos. Mentor programmes use large cards in GAFA and SFK columns, with detailed
course and exhibition records for Present the Absent, Living Art, the January
2026 Human–Machine Co-Creation winter school and the August 2025 NYU Multimodal
Experiments summer school, and Atlas of Moving Matter from the August 2026
MIT × Tongji summer school. The student-project directory is organised by cohort,
with 15 projects by five students in 2025 and 38 projects by eleven students in
2026. Selected covers, outcomes and films open in individual project readers;
student work retains its own authorship. The student archive is reached through
a rotating blue-green halftone globe with an orbiting satellite, a gently printed
Milky Way background and occasional distant meteors. The January winter-school
card uses the clarified miniature-office photograph credited to Chunying Xiao.
About and CV
share a scrolling page with an interactive ASCII background and a public English
CV PDF. Some records remain explicitly provisional. Reduced-motion preferences
are supported.

The MEILISHUO project includes separate visitor and collaborator galleries, with
visitor faces pixelated in the selected presentation photos. Artist-project images
use CANQI-signed web copies. Student images and animations carry their English
author or group names, while reference material retains its original credits.
Image enlargement controls and the separate lightbox have been removed; project
readers, gallery navigation and video playback remain available.
Image use and attribution are explained in `playtime-v1/site/copyright.html`.

## Local preview

From this repository root, run `python -m http.server 4187`, then open
`http://localhost:4187/playtime-v1/entrance-prototype/`.
No build step or package installation is needed; Three.js and its license are included.

## Files and publishing

The live runtime is in `playtime-v1/entrance-prototype/` and `playtime-v1/site/`.
The root `index.html` forwards visitors to the entrance and preserves old portfolio
hash links. `playtime-v1/manifest.json` records public asset sizes and SHA-256 hashes.
GitHub Pages publishes branch `main`, folder `/`; see `docs/PUBLISHING.md`.

Only public runtime assets are included. Blender sources, reference images, raw
portfolios, maintenance scripts and local backups remain outside this checkout.
