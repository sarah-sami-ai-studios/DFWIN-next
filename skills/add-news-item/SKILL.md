---
name: add-news-item
description: Adds a real contract, registration, event or sourcing news item to the DFWin track record. Use when the owner reports a new contract award, customer order, supplier registration, trade show, sponsorship or other company news to publish. Run with /add-news-item.
---

# Add a news item

News items are the site's proof. Every one must be real. The owner supplies the facts. You do not research, guess or embellish them.

## You need from the owner

- What happened, in their words.
- The date. If only the month is known, say so.
- The customer's name, if there is one, and confirmation that DFWin may name them publicly.
- The category: `Contract`, `Dry dock`, `Event`, `Registration` or `Sourcing`.

If the owner cannot confirm the customer can be named, do not publish the item.

## Steps

1. Open `src/_data/news.json`. Check the item is not already there.
2. Add a new object at the top of the array. Items are kept newest first.

   ```json
   { "date": "2026-11-03", "category": "Contract", "customer": "Customer Name", "title": "Short factual title", "summary": "One or two plain sentences: what was awarded, by whom, for which ship or programme." },
   ```

   | Field | Rule |
   | --- | --- |
   | `date` | `YYYY-MM-DD`. If only the month is known, use the first day and add `"approximateDate": true`. |
   | `category` | One of the five above, spelled exactly. |
   | `customer` | Only for items about a customer. Spell the name exactly as in `src/_data/customers.json` when the customer is already listed. Leave the field out for events and sourcing news. |
   | `title` | Under about 12 words. Sentence case. Who and what. |
   | `summary` | One or two sentences. Facts only. No contract value, quantity or delivery date unless the owner gave it and said it can be public. |

3. Follow `DESIGN.md`: no dashes, no exclamation marks, no banned words, customer named as fact and not as endorsement.
4. If the customer is new, ask the owner whether to add them to `src/_data/customers.json` (`name` and a short `note` listing what was supplied).
5. Do not touch `src/_data/stats.json` unless the owner gives a new figure and its source.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Open `track-record.html` and the home page. The item appears in the right place with the right date.
3. Check at 375px wide.

## Report

Show the owner the exact title and summary you published and ask them to confirm the wording.
