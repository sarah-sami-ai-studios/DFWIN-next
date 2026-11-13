---
name: dfwin-design
description: Designs new sections, components and pages in the DFWin site's visual language (dark navy, white type, one orange accent, photo led). Use when asked to add, redesign, restyle or lay out anything visible on the site, when writing CSS or Nunjucks markup, or when reviewing whether a page matches the design rules.
---

# DFWin design

`DESIGN.md` at the repo root is binding. Read it in full before you start. This skill tells you how to apply it.

## Before you design

1. Read `DESIGN.md`.
2. Open two existing pages in `src/` and their CSS in `src/assets/css/pages/`. Match their patterns.
3. Decide what the section must do for a buyer: can DFWin supply this, have they done it for companies like mine, how do I get a price.
4. Check the content exists in `src/_data/`. If the facts are not there, stop and ask. Never design around invented content.

## Tokens (defined in `src/assets/css/site.css`)

| Kind | Tokens |
| --- | --- |
| Background | `--navy-900` page, `--navy-950` deep, `--navy-850` raised, `--navy-800` media placeholder |
| Text | `--white` headings and body, `--mist` secondary, `--haze` small meta only |
| Lines | `--line` hairline, `--line-strong` control borders |
| Accent | `--signal` (hover, active mark, counter, focus ring). Never a large area. |
| Photo tile | `--paper` behind product photos, `--paper-ink` text on it |
| Fonts | `--font-display` headings, `--font-body` text, `--font-data` product IDs and figures |
| Type scale | `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl` |
| Space | `--gutter`, `--wrap` (1280px), `--section` |
| Shape | `--r-control` 4px, `--r-tile` 10px |
| Motion | `--ease-out`, `--fast` 160ms, `--slow` 520ms |

Never hard-code a colour, font, size or radius that a token covers.

## Shared classes

| Class | Use |
| --- | --- |
| `.wrap` | Page width and side gutters. Every section's content sits in one. |
| `.section`, `.section--tight` | Vertical rhythm. |
| `.section--raised`, `.section--deep`, `.section--ruled` | Lighter navy tint, darker navy tint, hairline on top. |
| `.section-head` | Heading plus intro paragraph at the top of a section. |
| `.page-head` | Top of an inner page: `h1` and optional `.lede`. |
| `.crumbs` | Breadcrumb list. |
| `.stack`, `.cluster` | Vertical gap group, horizontal wrapping group. |
| `.lede`, `.muted`, `.quiet`, `.measure`, `.data` | Intro text, `--mist`, `--haze`, 65ch line length, mono figures. |
| `.btn` with `.btn--primary`, `.btn--outline`, `.btn--small`, `.btn--block` | Buttons. Primary is white and turns orange on hover. |
| `.link-arrow` | Text link with an arrow icon. |
| `.media`, `.media--zoom` | Photo frame with 10px corners. |
| `.product-grid` plus the `partials/product-card.njk` include | Grid of product tiles. Never rebuild the card by hand. |
| `.chip`, `.tag` | Filter chip (round), small label (4px). |
| `.field`, `.form-grid`, `.span-2`, `.input`, `.hint`, `.error`, `.required` | Forms. |
| `.stat`, `.stat__value`, `.stat__label` | A sourced figure from `stats.json`. |
| `.quote` | A testimonial `figure`. Only rendered from `testimonials.json`. |
| `.prose` | Long text. |
| `.arc` | The orbital line ornament, inside an inline SVG. One per view at most. |
| `.reveal` | Settle-in on scroll. A few key blocks per page. |
| `.visually-hidden` | Text for screen readers only. |

## Layout rules

- Left-aligned. Headings and text never centred.
- Vary the layout between sections: split text and photo, ruled list, wide photo, product grid. Not the same block three times.
- Hairline rules and spacing instead of boxes. Never a card inside a card.
- Multi-column layouts collapse to one column under 760px. Test at 375px.
- Hero headline at most two lines on desktop. Supporting text about 25 words.
- Page styles go in `src/assets/css/pages/<name>.css`, loaded with `css: <name>` in front matter. Prefix page classes with the page name.

## Refuse these

If asked for any of these, explain that it breaks `DESIGN.md` and offer the nearest allowed option.

- White or light page sections, a light theme, or a theme toggle.
- Gradient text, glow, glass or blurred cards, drop shadows as decoration.
- Purple, teal, cyan, or a second accent colour.
- Small uppercase labels above headings. Numbered markers on content that is not a sequence.
- Rows of identical icon, heading and text cards.
- Customer logos, certification badges, award badges, star ratings.
- Counters that count up, marquees, parallax, looping or auto-playing motion, carousels.
- Stock icons drawn by hand, emoji, or an icon library other than `{% icon %}`.
- Text or badges over photos, except the home hero headline.
- A third call to action wording.
- New fonts, CSS frameworks or JavaScript frameworks.

## Self-review checklist

- [ ] I read `DESIGN.md` and matched an existing page's patterns.
- [ ] Tokens only. No hard-coded colours, fonts or radii.
- [ ] Left-aligned, no label above the heading, no nested cards.
- [ ] One accent, used small. At most one `.arc` in view.
- [ ] Every image has `alt`, `width`, `height` and goes through `rel`.
- [ ] Looks right at 1440px and 375px. No horizontal scroll.
- [ ] Keyboard focus visible on every new control. Contrast at least 4.5:1.
- [ ] Readable with animation off.
- [ ] Every fact on screen comes from `src/_data/`.
- [ ] `npm run build` passes.
