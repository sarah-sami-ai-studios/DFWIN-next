---
name: update-product
description: Changes, renames, re-photographs, re-categorises or removes an existing product in the DFWin catalog. Use when the owner asks to edit a product's name, description, category, keywords or photo, or to take a product off the site. Run with /update-product.
---

# Update or remove a product

Background: `.agents/skills/dfwin-catalog/SKILL.md`.

## Steps

1. **Find it.** Search `src/_data/products.json` by name or id. Show the owner the current entry. If more than one matches, ask which.

2. **Make the change.**

   | Change | Do this |
   | --- | --- |
   | Description | Edit `description`. Follow the rules in `.agents/skills/dfwin-content/SKILL.md`. No invented specifications. |
   | Search words | Add lower-case words to `keywords`. |
   | Category | Edit `category`. Reuse an existing spelling when one fits. |
   | Name | Edit `name` only. Keep `id` and `slug` the same so existing links keep working. |
   | Photo | Convert the new photo with the command in `.agents/skills/add-product/SKILL.md`, step 4, and save it over `src/assets/img/products/<slug>.webp`. Update `source_image`. |
   | Sector | Ask the owner first. Change `sector` and `category`. Keep `id` and `slug` as they are, even though the prefix no longer matches. |
   | Remove | Ask the owner to confirm. Delete the whole entry and its photo file. Then search `src/` for the id and the slug and remove any other mention. |

3. **Never** change an `id`. Never reuse a removed product's `id`. Change a `slug` only if the owner insists, and warn them that the old page address will stop working.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Open the product page and `catalog.html`. The change shows. Search and filters still find the product.
3. If you removed a product: the catalog count went down by one, and the link check in `.agents/skills/dfwin-qa/SKILL.md`, section 2, finds no missing links.
4. Check at 375px wide.

## Report

Show the owner the before and after of what changed.
