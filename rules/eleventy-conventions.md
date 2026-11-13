---
trigger: glob
globs: "src/**/*.njk, src/_data/*.json, src/assets/js/*.js, eleventy.config.js"
description: Eleventy, Nunjucks and data-file conventions for the DFWin site. Use when editing templates, data files, scripts or build configuration.
---

# Eleventy conventions

- Pages are `src/<name>.njk`. Every page starts with this front matter:

  ```
  ---
  layout: layouts/base.njk
  title: Page title
  description: One specific sentence under 160 characters.
  permalink: <name>.html
  ---
  ```

  Optional keys: `css: <name>`, `js: <name>`, `hideCta: true`, `ctaTitle`, `ctaText`, `noindex: true`, `ogImage`.
- One layout only: `src/_includes/layouts/base.njk`. Never create another. Never paste header, footer or `<head>` markup into a page.
- Every internal link and asset path uses the `rel` filter: `<a href="{{ 'catalog.html' | rel }}">`, `<img src="{{ product.image | rel }}">`. Never start a path with `/`. The site is served from a sub-folder.
- Full URLs for canonical tags, sitemap and structured data use the `abs` filter.
- Icons: `{% icon "arrow-right" %}`. Names come from https://phosphoricons.com. An unknown name fails the build on purpose.
- Content belongs in `src/_data/*.json`. Templates loop over data. Do not hard-code a product, news item, customer, statistic, email or office in a template.
- Data files must be valid JSON: double quotes, no trailing commas, no comments. Keep the existing field names and order.
- Navigation comes from `src/_data/nav.json`. Ask the owner before changing it.
- Filters available: `rel`, `abs`, `json`, `where(key, value)`, `limit(n)`, `isoDate`, `longDate`. Global data: `buildDate`, `year`.
- Scripts are plain browser JavaScript with no build step and no frameworks. `QuoteList` (in `quote-list.js`) is the only shared state.
- Do not add npm dependencies, change `eleventy.config.js`, or edit `.github/workflows/deploy.yml` without asking the owner.
- Never edit `_site/` or `legacy/`.
