---
name: edit-text
description: Changes wording on the DFWin site, such as a heading, paragraph, button label, call to action text, footer text or page description. Use when the owner asks to reword, fix a typo, shorten, update or replace text that is already on a page. Run with /edit-text.
---

# Edit text

## Steps

1. **Find where the text lives.** Search for a few exact words:

   ```bash
   grep -rn "exact words from the page" src/
   ```

   | Found in | What it is |
   | --- | --- |
   | `src/_data/*.json` | Content data. Edit the value here. It may appear on several pages. |
   | `src/_includes/partials/` | Header, footer, closing call to action, product card. Shown on every page. Tell the owner the change is site-wide. |
   | `src/<page>.njk` | Text on one page. |
   | Front matter (`title`, `description`, `ctaTitle`, `ctaText`) | Browser tab title, search result text, closing call to action. |

   If the text contains `{{ ... }}`, part of it comes from a data file. Change it there.

2. **Check the new wording** against `DESIGN.md` and `.agents/skills/dfwin-content/SKILL.md`:
   - Sentence case. No dashes. No exclamation marks. No banned words.
   - Buttons that lead to the quote page say "Request a quote". Buttons that lead to the catalog say "Browse the catalog". Do not change these two.
   - Any new fact is in `src/_data/` or the owner just gave it to you. If the owner's requested wording includes a claim you cannot source (a number, a certification, "largest", "leading"), say so and ask before publishing it.

3. **Make the smallest edit.** Change only the words. Leave the surrounding markup, classes and `{{ }}` tags alone.

4. **Keep it consistent.** Search for the old wording elsewhere in `src/` and offer to update the other places too.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Open each page that shows the text. Read it in place.
3. Check the text does not wrap badly or overflow at 1440px and 375px wide. Hero headlines stay within two lines on desktop.

## Report

Show the owner the old and new wording and list the pages affected.
