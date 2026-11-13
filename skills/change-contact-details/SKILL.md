---
name: change-contact-details
description: Updates DFWin's email addresses, office locations, company name, founding year, tagline, quote response time or site address. Use when the owner asks to change contact details, sales email, offices, addresses, phone numbers, legal name or the website domain. Run with /change-contact-details.
---

# Change contact details

All of these live in one file: `src/_data/site.json`. Every page reads from it. Never type an email address or office into a template.

## Fields

| Field | Shown | Notes |
| --- | --- | --- |
| `name`, `shortName`, `legalName` | Titles, footer, structured data | `legalName` is "Hong Kong DFWin Int'l Co. Limited". |
| `tagline` | Footer | |
| `description` | Default search result text | Under 160 characters. Facts only. |
| `url` | Canonical links, sitemap, social previews | The live site address with no slash at the end. Change it when the domain changes. |
| `founded` | Structured data and wherever a page uses it | A year. See the open question in `PRODUCT.md`. |
| `email.sales` | Quote page, footer, quote emails | Quote requests go here. |
| `email.general` | Footer | |
| `offices` | Footer, quote page, about page | Array of `{ "city", "role", "country" }`. |
| `quote.responseTime` | Call to action and quote page ("We answer within ...") | Only promise what sales can keep. |
| `quote.endpoint` | Not shown | See `.agents/skills/connect-quote-form/SKILL.md`. |

## Steps

1. Ask the owner to confirm the exact new value, spelled out. Read it back. A wrong sales email loses quote requests.
2. Edit the value in `src/_data/site.json`. Keep it valid JSON.
3. Adding a street address or phone number: the owner must confirm the exact text first. Add the new field to the office object (for example `"address": "..."`, `"phone": "+1 ..."`), then check whether `src/_includes/partials/footer.njk`, `src/quote.njk` and `src/about.njk` show it. If a template needs changing to show it, tell the owner what you will change before you do.
4. Search for stray copies of the old value and fix any you find:

   ```bash
   grep -rn "old value" src/
   ```

5. If the fact is listed under "Open questions" in `PRODUCT.md` and the owner has now confirmed it, update `PRODUCT.md` too.
6. If `url` changed, also read `docs/AI-SEARCH-VISIBILITY.md` for the search console steps.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Check the footer, `quote.html` and `about.html` show the new details.
3. On `quote.html` with `quote.endpoint` empty, prepare a test request and confirm the email draft is addressed to the right sales email.
4. Check at 375px wide.

## Report

List each value changed, old and new, and ask the owner to send one real test email to any new address.
