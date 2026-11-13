---
name: seo-check
description: Checks that DFWin pages can be found and correctly described by search engines and AI assistants. Covers titles, descriptions, headings, sitemap, robots, llms.txt and structured data. Use after adding or renaming pages or products, before a launch or domain change, or when the owner asks about SEO, Google, search ranking or AI search visibility. Run with /seo-check.
---

# SEO and AI search check

The full guide is `docs/AI-SEARCH-VISIBILITY.md`. Read it first and follow it. If that file does not exist yet, tell the owner and run the checks below.

Truth rules still apply. Never add a claim, a rating, a review or a certification to metadata or structured data to rank better.

## Steps

1. `npm run build`.
2. **Every page has a specific title and description.** List them:

   ```bash
   for f in _site/*.html; do echo "$f"; grep -o '<title>[^<]*</title>' "$f"; grep -o '<meta name="description" content="[^"]*"' "$f"; done
   ```

   - No two pages share a title or a description.
   - Descriptions are under 160 characters and say what is on the page.
   - Fix by editing `title` and `description` in the page's front matter. Product pages take theirs from `products.json`.

3. **One `h1` per page**, and headings step down in order (`h1`, `h2`, `h3`):

   ```bash
   for f in _site/*.html; do echo "$f: $(grep -o '<h1' "$f" | wc -l) h1"; done
   ```

4. **Site address.** `url` in `src/_data/site.json` matches the real live address. Canonical links, the sitemap and social previews are built from it.

5. **Generated files exist and are current.** Check `_site/sitemap.xml`, `_site/robots.txt`, `_site/llms.txt`, `_site/llms-full.txt` and `_site/catalog.json`:
   - The sitemap lists every page and every product, with full addresses.
   - `robots.txt` points to the sitemap and does not block the site.
   - `llms.txt` describes the company using only facts from `src/_data/`.

   Their templates are `src/sitemap.xml.njk`, `src/robots.txt.njk`, `src/llms.txt.njk`, `src/llms-full.txt.njk` and `src/catalog.json.njk`.

6. **Structured data is valid JSON** and contains no invented facts:

   ```bash
   node -e 'const fs=require("fs");const h=fs.readFileSync("_site/index.html","utf8");for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){JSON.parse(m[1]);console.log("valid JSON-LD block")}'
   ```

   Repeat for one product page in `_site/products/`. No `aggregateRating`, `review`, `offers` with prices, or certification fields.

7. **Images.** Every content image has useful `alt` text. Product photos use the product name.

8. **Social preview.** The `og:image` file named in the built page exists in `_site/`.

9. **Search consoles.** If the owner has verification codes from Google Search Console or Bing Webmaster Tools, put them in `verification.google` and `verification.bing` in `src/_data/site.json`. These codes are public and safe to commit.

## Verify

Run the link check in `.agents/skills/dfwin-qa/SKILL.md`, section 2, then `npm run build` once more.

## Report

List what passed, what you fixed, and what only the owner can do (for example submitting the sitemap in Search Console).
