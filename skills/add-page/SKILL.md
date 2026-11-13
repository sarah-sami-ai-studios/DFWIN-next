---
name: add-page
description: Creates a new page on the DFWin site with the shared layout, its own stylesheet and an optional navigation link. Use when the owner asks for a new page, landing page or section of the site that needs its own address. Run with /add-page.
---

# Add a page

Read `DESIGN.md` and `.agents/skills/dfwin-design/SKILL.md` first.

## Before you build

1. Agree with the owner: the page's purpose, its name, and what a buyer should do after reading it.
2. Check every fact the page needs is in `src/_data/` or supplied by the owner. If not, stop and ask.
3. Ask whether the page should be in the main navigation, the footer, or neither. Never change navigation without a yes.

## Steps

1. **Create `src/<name>.njk`.** Use a short lower-case name with hyphens.

   ```njk
   ---
   layout: layouts/base.njk
   title: Page title
   description: One specific sentence under 160 characters about this page.
   permalink: <name>.html
   css: <name>
   ---
   <section class="page-head">
     <div class="wrap">
       <h1>Page heading in sentence case</h1>
       <p class="lede">One or two sentences that say what this page covers.</p>
     </div>
   </section>

   <section class="section section--ruled">
     <div class="wrap">
       <div class="section-head">
         <h2>Section heading</h2>
         <p>Intro sentence.</p>
       </div>
       <!-- content -->
     </div>
   </section>
   ```

   - The shared layout adds the header, the closing call to action and the footer. Do not repeat them.
   - To change the closing call to action text, set `ctaTitle` and `ctaText` in front matter. To hide it, set `hideCta: true`.
   - Every link and image path uses the `rel` filter. Icons use `{% icon "name" %}`.

2. **Create `src/assets/css/pages/<name>.css`** for styles only this page needs. Use tokens from `site.css`. Prefix classes with the page name. If the page needs no styles of its own, leave out the file and the `css:` line.

3. **Add the link**, only if the owner said yes, in `src/_data/nav.json`:
   - Main navigation: add `{ "label": "Label", "url": "<name>.html" }` to `main`. Keep it to six items or fewer.
   - Footer: add the same object to the right column's `links`.

4. **Search and AI listings.** Open `src/sitemap.xml.njk`, `src/llms.txt.njk` and `src/llms-full.txt.njk`. If they list pages by hand, add the new page in the same style. If they build the list automatically, do nothing.

5. Page script, only if needed: `src/assets/js/<name>.js` plus `js: <name>` in front matter. Plain JavaScript, no libraries.

## Verify

1. `npm run build` ends with no errors and writes `_site/<name>.html`.
2. `npm run dev`. Open `http://localhost:8080/<name>.html` at 1440px and 375px wide.
3. The navigation link works from the home page and from a product page (a page one folder down).
4. Run the checklist in `.agents/skills/dfwin-design/SKILL.md` and the link check in `.agents/skills/dfwin-qa/SKILL.md`.

## Report

Tell the owner the page address, where it is linked from, and any content they still need to supply.
