# Publishing and maintenance

This repository is a static GitHub Pages project site. The intended URL is `https://canqik.github.io/PersonalWebsite/`.

## GitHub Pages setup

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Set the branch to `main` and folder to `/ (root)`, then save.
4. GitHub will publish changes pushed to `main`. Confirm the URL shown in Pages settings after the first build.

There is no custom domain, build command, package install, or GitHub Actions workflow. `.nojekyll` allows the HTML/CSS/JS files to be served directly.

## Updating the site

Edit the public files, check the JavaScript syntax with `node --check app.js`, review the changed pages in a browser, then commit and push to `main`. GitHub Pages may take a few minutes to reflect a push. GitHub's **Actions** tab and **Settings → Pages** show build status.

The project URL contains `/PersonalWebsite/`. Keep links to local assets relative (`styles.css`, `app.js`) and navigation as URL fragments (`#works`, `#about`) so they work both locally and on Pages.

## Publication boundary

Only files inside this repository are public. Keep original media, application material, private records, draft research notes, and credentials outside it. Before adding real project images, export web copies with the required permissions and credits; do not commit raw masters or private metadata.

The current content status and remaining publication checks are in [CONTENT.md](CONTENT.md).
