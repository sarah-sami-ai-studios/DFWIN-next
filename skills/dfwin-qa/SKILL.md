---
name: dfwin-qa
description: Tests the DFWin site before changes are reported as done or published. Covers the build, links, desktop and phone widths, keyboard use, contrast, horizontal scroll and the quote flow end to end. Use after any change to templates, styles, scripts or data, before committing or deploying, or when asked to check, test, review or QA the site.
---

# DFWin QA

Work through every section that your change could affect. Report failures plainly. Do not report "done" with a known failure.

## 1. Build

```bash
npm run build
```

- Ends with no errors. Read the whole output.
- The number of files written is sensible: one per page in `src/`, plus one per product.
- An "Unknown icon" error means a wrong name in `{% icon %}`. A JSON parse error means a data file has a missing comma, a trailing comma or a wrong quote.

## 2. Links and assets

Run against the built site:

```bash
node -e '
const fs=require("fs"),path=require("path");const root="_site";let bad=0;
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const f of walk(root).filter(f=>f.endsWith(".html"))){
  const html=fs.readFileSync(f,"utf8");
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const u=m[1];
    if(/^(https?:|mailto:|tel:|data:|#)/.test(u))continue;
    if(u.startsWith("/")){console.log("ROOT PATH",f,u);bad++;continue;}
    const t=path.join(path.dirname(f),u.split(/[?#]/)[0]);
    if(t&&!fs.existsSync(t)){console.log("MISSING",f,u);bad++;}
  }
}
console.log(bad?bad+" problem(s)":"All internal links and assets resolve");'
```

- `MISSING` means a broken link or a missing image. Fix it.
- `ROOT PATH` means a path starts with `/`. Put it through the `rel` filter.

## 3. Look at it

```bash
npm run dev
```

Open http://localhost:8080 in the browser. For each changed page, and always the home page:

| Check | 1440px wide | 375px wide |
| --- | --- | --- |
| No horizontal scroll | | |
| Nothing overlaps or is cut off | | |
| Multi-column layouts are one column on the phone | n/a | |
| Header: logo, navigation, "Request a quote" | | menu button opens and closes |
| Images load and are sharp, none stretched | | |
| Headings do not break badly | | |

To test for horizontal scroll, run this in the browser console. It must print `true`:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

## 4. Keyboard pass

Without the mouse, on each changed page:

- Tab from the top. The first stop is "Skip to content".
- Every link, button and form control is reachable in a sensible order.
- Focus is always visible.
- Enter and Space activate buttons. Escape closes the phone menu.

## 5. Contrast and readability

- Body text is `--white` or `--mist` on navy. `--haze` is only for small meta text.
- No text sits on a photo, except the home hero headline.
- Turn on "reduce motion" in the browser's rendering tools. Everything is still visible.

## 6. Quote flow, end to end

Run this whenever products, the catalog, the quote list, the quote page or `site.json` changed.

1. Open `catalog.html`. Search for a product. Add two products to the quote list. The header counter shows 2.
2. Open one product page. Set a quantity. Add it. The counter shows 3.
3. Open `quote.html`. All three products are listed with the right quantities. Change one quantity and remove one item.
4. Submit the form empty. Each required field shows a clear error.
5. Fill the form with test details and submit.
   - If `quote.endpoint` in `src/_data/site.json` is empty: an email draft opens, addressed to the sales email, listing the products.
   - If `quote.endpoint` is set: tell the owner that a real test message will be sent, then submit, and ask them to confirm it arrived.
6. Reload the page. The list behaves as the page says it should after sending.

## 7. Content check

Search the files you changed:

```bash
git diff -U0 -- src | grep "^+" | grep -nE "$(printf '\xe2\x80\x94|\xe2\x80\x93')|!|seamless|elevate|unleash|world-class|cutting-edge|leverage|synergy|revolutioni|best-in-class|one-stop" || echo "clean"
```

The `printf` part matches em dashes and en dashes.

- Any hit in visible copy must be fixed. Hits in code (`!==`, `<!doctype`) are fine.
- Every new fact is in `src/_data/` or came from the owner.

## 8. Report

Tell the owner in plain English: what you tested, what passed, what failed and what you fixed, and anything you could not test.
