---
name: preview-and-deploy
description: Previews the DFWin site locally, commits the changes, pushes them to GitHub and confirms the live site updated. Use when the owner asks to preview, save, commit, publish, deploy, go live or push changes, or asks why a change is not live. Run with /preview-and-deploy.
---

# Preview and deploy

Publishing is automatic. A push to GitHub on a branch listed in `.github/workflows/deploy.yml` (currently `main` and `redesign-2026`) starts a GitHub Actions run that builds the site and publishes it to GitHub Pages.

Never push unless the owner has said to publish.

## 1. Preview

```bash
npm install        # first time only, or after package.json changed
npm run dev
```

Open http://localhost:8080. Check the changed pages at 1440px and 375px wide. Run the checks in `.agents/skills/dfwin-qa/SKILL.md`. Stop the server with Ctrl+C when finished.

## 2. Build check

```bash
npm run build
```

It must end with no errors. Do not go further if it fails.

## 3. Review what changed

```bash
git status
git diff
```

- Only files you meant to change are listed.
- `_site/` and `node_modules/` are not listed.
- No passwords, API keys or tokens anywhere in the diff.
- Tell the owner in plain English what will be published and wait for a yes.

## 4. Commit

Stage the files by name. Do not use `git add .` without reading `git status` first.

```bash
git add src/_data/products.json src/assets/img/products/hospitality-electric-kettle.webp
git commit -m "feat: add electric kettle to catalog"
```

Message format: `<type>: <what changed>`. Types: `feat` (new content or feature), `fix` (correction), `docs`, `chore`. One topic per commit.

## 5. Push

```bash
git branch --show-current
git pull --rebase
git push
```

The current branch must be one listed under `on: push: branches:` in `.github/workflows/deploy.yml`. If it is not, stop and ask the owner.

If the pull reports a conflict, stop. Explain it to the owner. Do not force anything.

## 6. Watch the run

Open https://github.com/kevinmjones/DFWIN/actions. The newest run is "Deploy site to GitHub Pages". It takes about one to three minutes.

With the GitHub CLI:

```bash
gh run watch --repo kevinmjones/DFWIN
```

- Green tick: published.
- Red cross: open the run, read the failed step, fix the cause locally, rebuild, commit and push again. The live site keeps the previous version until a run succeeds.

## 7. Confirm live

Open the live address from `url` in `src/_data/site.json` (currently https://kevinmjones.github.io/DFWIN/). Reload with Ctrl+Shift+R, or Cmd+Shift+R on a Mac, to skip the browser's saved copy. Check the changed page.

## Undo a published change

Never rewrite history. Never use `git push --force` or `git reset --hard` on a published branch.

```bash
git log --oneline -10          # find the commit to undo
git revert <commit-id>         # makes a new commit that reverses it
npm run build                  # confirm the site still builds
git push
```

Then watch the run and confirm live as above.

## One-time setup (already done unless the repo moved)

In GitHub: Settings, then Pages, then Build and deployment, Source set to "GitHub Actions".
