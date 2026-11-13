---
name: dfwin-catalog
description: Explains the DFWin product catalog data model, the product photo pipeline, and how catalog search, filters, product pages and the quote list work. Use when adding, changing, removing or reordering products, adding a sector or category, fixing a missing product image, or debugging catalog search, filtering or product pages.
---

# DFWin catalog

## Where things are

| Thing | File |
| --- | --- |
| Product data | `src/_data/products.json` (one array, one object per product) |
| Sectors | `src/_data/sectors.json` |
| Product photos | `src/assets/img/products/<slug>.webp` |
| Catalog page | `src/catalog.njk`, `src/assets/css/pages/catalog.css`, `src/assets/js/catalog.js` |
| Product page (one template makes every product page) | `src/product.njk`, `src/assets/css/pages/product.css` |
| Product card | `src/_includes/partials/product-card.njk` |
| Quote list | `src/assets/js/quote-list.js` (storage), `src/assets/js/site.js` (buttons and counter) |

## Product object

```json
{
  "id": "HOSP-0059",
  "name": "Electric Kettle",
  "sector": "Hospitality",
  "category": "In-room appliances",
  "slug": "hospitality-electric-kettle",
  "image": "assets/img/products/hospitality-electric-kettle.webp",
  "source_image": "kettle.jpg",
  "description": "Electric kettle for guest rooms and cabins. Capacity, finish and plug type are confirmed in your quote.",
  "keywords": ["kettle", "water", "boiler", "tea", "coffee", "in-room"],
  "status": "Active"
}
```

| Field | Rule |
| --- | --- |
| `id` | Prefix by sector: `HOSP-` Hospitality, `MARI-` Marine, `TECH-` Technology. Then a four-digit number. The number is one running sequence across all sectors: take the highest number in the whole file and add 1. Never reuse or change an id. Buyers quote these in emails. |
| `name` | Short plain name, as a buyer would search for it. |
| `sector` | Exactly one `key` from `sectors.json`: `Hospitality`, `Marine`, `Technology`. |
| `category` | Reuse an existing category in that sector, spelled exactly the same, when one fits. A new category needs no other change: filters build themselves from the data. |
| `slug` | `<sector in lower case>-<name in lower case with hyphens>`. Letters, digits and hyphens only. Must be unique. It becomes the page address `products/<slug>.html`, so do not change it after publishing. |
| `image` | `assets/img/products/<slug>.webp`. No leading slash. |
| `source_image` | The original file name the photo came from. For reference only. |
| `description` | Generic. See the `dfwin-content` skill. No specifications. |
| `keywords` | Lower-case search words a buyer might type that are not in the name: synonyms, plural, use. |
| `status` | `Active`. |

List the current categories with:

```bash
node -e 'const p=require("./src/_data/products.json");const c={};p.forEach(x=>c[x.sector+" / "+x.category]=(c[x.sector+" / "+x.category]||0)+1);console.log(c);console.log("highest id number:",Math.max(...p.map(x=>+x.id.split("-")[1])))'
```

## Photo pipeline

Target: square, white background, WebP, 900 by 900 pixels (never more than 1000), product centred with a margin, under about 60 KB.

With ImageMagick:

```bash
magick "INPUT.jpg" -auto-orient -fuzz 4% -trim +repage -resize 800x800 \
  -background white -gravity center -extent 900x900 -strip -quality 82 \
  "src/assets/img/products/SLUG.webp"
```

Without ImageMagick:

```bash
npx sharp-cli -i "INPUT.jpg" -o "src/assets/img/products/SLUG.webp" \
  -f webp -q 82 resize 900 900 --fit contain --background "#ffffff"
```

Check the result: `magick identify "src/assets/img/products/SLUG.webp"` should report `900x900`. Open the file and look at it.

- The source photo must show the product on a white or near-white background. If it does not, tell the owner. Do not publish a busy photo and do not generate a fake one.
- Use only photos the owner supplied or has the right to use. Never download a photo from another company's website.
- Never copy the owner's original into the repo. Only the `.webp` is committed.

## How the pages work

- **Product pages.** `src/product.njk` uses Eleventy pagination over `products.json` with `size: 1`. Every product gets `products/<slug>.html` automatically. Do not create product pages by hand.
- **Catalog page.** All product cards are in the HTML. `catalog.js` shows or hides cards. Nothing is fetched.
- **Search.** Each card has a `data-search` string built from name, id, sector, category and keywords. Every word typed must appear in it. Simple plurals are handled ("towels" finds "towel"). Spaces and hyphens are ignored ("keycard" finds "key card"). To make a product easier to find, add words to `keywords`.
- **Filters.** Sector chips and the category menu are generated from the data. Filters are kept in the address: `catalog.html?q=towel&sector=hospitality&category=Carts`. `catalog.html#marine` is a sector shortcut used by the footer.
- **Related products.** The product page picks up to four from the same category, then the same sector.
- **Quote list.** "Add to quote list" stores `{ id, name, qty }` in the visitor's own browser under the key `dfwin.quoteList.v1`. The quote page reads that list. Nothing is sent anywhere until the visitor submits the quote form.

## Adding a sector

Ask the owner first. It needs a new entry in `sectors.json` (`key`, `slug`, `title`, `summary`, `image`), a new id prefix, a sector photo, and a footer link in `nav.json`.

## After any catalog change

1. `npm run build` with no errors.
2. `npm run dev`. Open `catalog.html`: the count is right, search finds the product by name and by id, the sector chip and category filter show it.
3. Open `products/<slug>.html`: photo loads, description reads well, "Add to quote list" works.
4. Open `quote.html`: the product is in the list.
5. Check the catalog at 375px wide.
