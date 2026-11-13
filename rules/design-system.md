---
trigger: glob
globs: "src/**/*.njk, src/assets/css/**/*.css"
description: Visual and layout rules for DFWin templates and stylesheets. Use when creating or changing any page, section, component or style.
---

# Design system

`DESIGN.md` is binding. Read it first. For new sections or pages also read `.agents/skills/dfwin-design/SKILL.md`.

- Use the tokens in `src/assets/css/site.css` (`--navy-900`, `--mist`, `--signal`, `--text-*`, `--r-control`, `--r-tile`). Never hard-code a colour, font or radius.
- The whole site is dark navy with white type. No light sections. The only light surfaces are product photo tiles (`--paper`) and the primary button.
- `--signal` orange is the only accent. Small marks only, never a large area.
- No gradients on text, glow, glass cards, purple, teal or cyan.
- Reuse the shared classes before writing new CSS: `.wrap`, `.section`, `.section-head`, `.stack`, `.cluster`, `.btn`, `.link-arrow`, `.media`, `.product-grid`, `.chip`, `.tag`, `.field`, `.form-grid`, `.stat`, `.quote`, `.prose`.
- New page-only styles go in `src/assets/css/pages/<name>.css`. Change `site.css` only for something every page needs, and ask first.
- Left-aligned. No centred headings or body text. No small uppercase label above a heading. No 01 / 02 / 03 markers unless the order is real.
- No page made of identical icon, heading and text cards. No card inside a card. Prefer hairline rules (`1px solid var(--line)`) and spacing.
- Every multi-column layout collapses to one column under 760px. No horizontal scroll at 375px.
- Corners: controls 4px, photos and tiles 10px, chips fully round. Nothing else.
- At most one `.arc` ornament per view. No text or badges over photos, except the home hero headline.
- Motion: `reveal` on a few key blocks only. No loops, parallax, marquees or counting numbers.
- Only two calls to action, with this exact wording: "Request a quote" and "Browse the catalog".
- Every image has `alt`, `width` and `height`. Every form control has a visible `<label>`. Focus is always visible. Text contrast is at least 4.5:1.
