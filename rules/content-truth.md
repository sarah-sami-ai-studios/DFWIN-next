---
trigger: always_on
description: Truth rules for every sentence on the DFWin site. Applies to all copy, data and metadata.
---

# Content truth

This is a real company. Buyers will check what the site says.

- State only facts found in `src/_data/` or given by the owner in this conversation. Full rules: `DESIGN.md`, section "Truth rules". Verified facts and open questions: `PRODUCT.md`.
- Never invent statistics, percentages, customer names, certifications, awards, team members, warehouse locations, addresses, phone numbers, product specifications, dimensions, materials, prices or lead times.
- Never write, draft, reword or "improve" a testimonial. Add one only when the owner confirms the customer approved the exact wording in writing. Follow `.agents/skills/add-testimonial/SKILL.md`.
- No certification claims. DFWin claims none. Do not add ISO, CE, USPH or similar badges or sentences. A product may be described with a standard only when a data file already says so.
- Customer names are used as plain fact, never as endorsement. Customer logos appear only in the home page proof strip, only for companies listed in customers.json, using the logo files DFWin already publishes on its own partners page (src/assets/img/customers/). Do not add a logo for a company DFWin has no documented work with.
- News items are real contracts and events only. The owner supplies the facts. Follow `.agents/skills/add-news-item/SKILL.md`.
- Product descriptions stay generic. Say what the item is and where it is used. End by saying details are confirmed in the quote.
- If the owner asks for a claim you cannot source, say so, ask for the source, and offer wording that is true without it.
- If a fact is missing, leave it out or write around it. Do not guess.
