---
name: dfwin-content
description: Writes and reviews copy for the DFWin site in its voice and under its truth rules. Use when writing or editing headings, page text, product descriptions, news items, meta descriptions, button labels or alt text, or when asked to make text sound better, more persuasive or more impressive.
---

# DFWin content

Rules live in `DESIGN.md` (sections "Words" and "Truth rules") and `PRODUCT.md` (verified facts). Read both first.

## Voice

An experienced supplier talking to a professional buyer. Plain, specific, confident. Short sentences. No hype.

- Say what DFWin supplies, who it has supplied, and how to get a price.
- Prefer a concrete noun to an adjective. "Minibar fridges for the seventh Oasis-class ship" beats "premium solutions for leading brands".
- Sentence case for headings and buttons.
- No em dashes or en dashes. Use a comma, a full stop, or "to" for ranges.
- No exclamation marks.
- Calls to action use these exact words only: "Request a quote" and "Browse the catalog".

## Banned words

seamless, elevate, unleash, world-class, cutting-edge, leverage, solutions (as filler), synergy, revolutionize, best-in-class, one-stop.

Also avoid: premium, leading, trusted, unrivalled, state-of-the-art, innovative, passionate, tailored, bespoke, "we pride ourselves", "look no further". They claim quality without evidence.

## Truth test

Before you keep a sentence, ask: where is this fact?

- In `src/_data/`: keep it.
- The owner said it in this conversation: keep it, and add it to the right data file.
- Nowhere: delete it or ask the owner. Do not soften it into a vague claim.

Never write: statistics, percentages, years of experience other than the dates in the data, numbers of customers or countries, certifications, awards, team size, warehouse locations, addresses, delivery times, prices, minimum orders, materials, dimensions, capacities, warranties.

Customer names are stated as fact ("Norwegian Cruise Line awarded DFWin a luggage cage order"), never as praise ("trusted by Norwegian Cruise Line").

## Product descriptions (`description` in `products.json`)

The catalog has no confirmed specifications. Descriptions are generic on purpose.

- One or two sentences, about 20 to 35 words.
- Sentence one: what the item is and where it is used (hotel, ship, port, guest room, back of house).
- Sentence two: what is confirmed in the quote (size, colour, material, branding, quantity).
- Only describe what is visible in the photo or stated by the owner.
- No materials, dimensions, capacities, power ratings, standards or brand names unless the owner supplied them in writing for this product.

Good: "Folding luggage cart for moving guest bags between the lobby, the pier and guest rooms. Size, finish and branding are confirmed in your quote."

Bad: "Premium 304 stainless steel cart with a 300kg load rating, trusted by leading cruise lines."

## News items (`news.json`)

- Real contracts, registrations, events and sourcing news only. The owner supplies the facts.
- `title`: who and what, under about 12 words. No hype.
- `summary`: one or two plain sentences. What was awarded, by whom, for which ship or programme.
- No contract values, quantities or delivery dates unless the owner gives them and confirms they can be public.
- If only the month is known, use the first day of the month and add `"approximateDate": true`.

## Page titles and descriptions

- `title`: short and specific.
- `description`: under 160 characters, says what is on the page, no slogans.

## Alt text

Describe what the photo shows in a few words. Decorative images get `alt=""`. Product photos use the product name.

## Review checklist

- [ ] Every fact is in `src/_data/` or came from the owner.
- [ ] No banned words, no dashes, no exclamation marks.
- [ ] Sentence case. Only the two call to action wordings.
- [ ] No invented testimonial, statistic, certification or specification.
- [ ] It reads like a supplier talking, not an advert.
