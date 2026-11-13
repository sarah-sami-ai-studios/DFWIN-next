---
trigger: always_on
description: What must be checked before any task on the DFWin site is reported as done.
---

# Verification

Do all of this before you say a task is done. Full checklist: `.agents/skills/dfwin-qa/SKILL.md`.

1. Run `npm run build`. It must end with no errors. If it fails, fix the cause. Never hide an error.
2. Run `npm run dev` and open each page you changed at http://localhost:8080. Look at 1440px wide and 375px wide.
3. Confirm: no horizontal scroll, nothing overlapping, images load, links you touched work.
4. If you touched products, the catalog, the quote list or the quote form, run the quote flow: add a product, open the quote page, check it is listed.
5. Search your diff for em dashes, en dashes, exclamation marks, banned words from `DESIGN.md`, and paths that start with `/`.
6. Report in plain English: what changed, which files, how you checked, and what the owner still needs to confirm.

Never commit `_site/`, `node_modules/` or secrets. Never push unless the owner asked. Never use `git push --force` or rewrite history. To undo, use `git revert`.
