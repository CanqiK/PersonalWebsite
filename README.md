# CANQI — Portfolio

Current public runtime, updated 21 October 2026.

- Website: https://canqik.github.io/PersonalWebsite/
- Entrance: https://canqik.github.io/PersonalWebsite/playtime-v1/entrance-prototype/
- Main page: https://canqik.github.io/PersonalWebsite/playtime-v1/site/index.html#main

The established `playtime-v1` URL is kept as the current preview address.
Earlier versions remain recoverable through Git history and the original version tag.

## Current version

An interactive low-poly office entrance with synthesized sound, bubble hit feedback,
character-only pixel/glitch effects, and a surveillance-to-poster transition into
the portfolio. The homepage is a responsive low-poly investigation room with layered parallax,
window rain, a perspective-mapped CRT emblem and desktop photographs. Some seated
office workers now have long hair and adjusted silhouettes. About and CV share a
scrolling page; the CV links to the public English PDF. Work imagery still includes
labeled abstract placeholders. Reduced-motion preferences are supported.

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
