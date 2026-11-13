---
name: add-product
description: Adds a new product to the DFWin catalog, including its photo. Use when the owner asks to add, list or publish a new product or item, or supplies a product name and photo. Run with /add-product.
---

# Add a product

Background: `.agents/skills/dfwin-catalog/SKILL.md` (data model) and `.agents/skills/dfwin-content/SKILL.md` (description rules).

## You need from the owner

- Product name.
- Sector: Hospitality, Marine or Technology.
- Category. Suggest an existing one if it fits.
- A photo file and where it is on their computer.
- Optional: facts they want stated. Only use facts they give you.

Ask for anything missing. Do not guess.

## Steps

1. **Read the data.** Open `src/_data/products.json`. Check the product is not already there. List categories and the highest id number:

   ```bash
   node -e 'const p=require("./src/_data/products.json");console.log([...new Set(p.map(x=>x.sector+" / "+x.category))].sort().join("\n"));console.log("highest id number:",Math.max(...p.map(x=>+x.id.split("-")[1])))'
   ```

2. **Choose the id.** Prefix `HOSP-`, `MARI-` or `TECH-` by sector. Number = highest number in the whole file plus 1, four digits. Example: highest is 58 and the sector is Hospitality, so the id is `HOSP-0059`.

3. **Choose the slug.** `<sector in lower case>-<name in lower case with hyphens>`. Example: `hospitality-electric-kettle`. Confirm no other product has it.

4. **Prepare the photo.** It must be the product on a white background. Output: square, WebP, 900 by 900 pixels, saved as `src/assets/img/products/<slug>.webp`.

   ```bash
   magick "/path/to/kettle.jpg" -auto-orient -fuzz 4% -trim +repage -resize 800x800 \
     -background white -gravity center -extent 900x900 -strip -quality 82 \
     "src/assets/img/products/hospitality-electric-kettle.webp"
   ```

   If `magick` is not installed:

   ```bash
   npx sharp-cli -i "/path/to/kettle.jpg" -o "src/assets/img/products/hospitality-electric-kettle.webp" \
     -f webp -q 82 resize 900 900 --fit contain --background "#ffffff"
   ```

   Open the result and look at it. If the background is not white or the product is cut off, stop and tell the owner. Never generate or download a substitute photo.

5. **Write the description.** One or two sentences. What it is and where it is used, then what is confirmed in the quote. No materials, sizes, capacities, standards or prices unless the owner gave them for this product.

6. **Add the entry** at the end of the array in `src/_data/products.json`:

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

   Put a comma after the previous entry's closing brace. No comma after the last entry.

7. **Check other mentions.** Search `src/` for sentences that list products "not in the catalog" (for example the note at the bottom of `src/catalog.njk`). If the new product is named there, tell the owner and offer to remove it from that sentence.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Open `http://localhost:8080/products/<slug>.html`: photo, name, id, description and "Add to quote list" all work.
3. Open `catalog.html`: the count went up by one. Search finds the product by name and by id. Its sector chip and category filter show it.
4. Add it to the quote list and open `quote.html`: it is listed.
5. Check the product page and catalog at 375px wide.

## Report

Tell the owner the id, the page address, the description you wrote, and ask them to confirm the description is accurate.
