# Publishing and maintenance

GitHub Pages serves `main` from `/ (root)` with `.nojekyll`, without a custom build.
The stable entrance is `/PersonalWebsite/playtime-v1/entrance-prototype/` and its
destination is the adjacent `../site/index.html`. Keep relative URLs intact.

## Update workflow

1. Make and review local changes. Publish only when the owner requests it.
2. Fetch `origin/main` into the deployment checkout and ensure it is current.
3. Stage only public runtime files using the local `_maintenance/publish-current.py`
   allowlist; update the asset manifest. Do not upload the full working directory.
4. Check changed JavaScript syntax, relative resource paths and `git diff --check`.
   The owner performs visual review.
5. Commit and push normally to `main`. Never force push to publish.
6. Wait for the GitHub Pages build and verify the public manifest and entry URLs.

The public CV PDF and two web-sized Carnival process videos are intentionally included
despite the general PDF/video ignore rules. Asset-level exceptions keep them in Git.
Do not add private source portfolios, Blender masters, credentials or local backups.
Historical releases can be recovered from the repository's commits and tags.
