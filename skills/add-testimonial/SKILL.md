---
name: add-testimonial
description: Adds a customer testimonial to the DFWin site, only when the customer has approved the exact wording in writing. Use when the owner asks to add a testimonial, customer quote, review, endorsement or reference. Run with /add-testimonial.
---

# Add a testimonial

A testimonial is a named person's own words. Publishing words they did not approve is dishonest and can end a customer relationship. This skill has a hard gate.

## The gate

Ask the owner these three questions. Continue only if every answer is yes.

1. Did the customer write or approve this exact wording?
2. Is the approval in writing (email, letter or signed form) and do you have it on file?
3. Did the customer agree to their name, job title and company being shown on the website?

If any answer is no or unsure: stop. Do not add anything. Offer to help the owner write an email asking the customer for a quote and for permission. That email asks. It never suggests the wording.

## Never

- Never write, draft, suggest, shorten, tidy, translate or "improve" a testimonial.
- Never turn a news item, an email, a phone call or a general impression into a quote.
- Never add a testimonial as a placeholder or example.
- Never add a customer logo or a star rating.

If the approved text contains a typing error, ask the owner to get the corrected wording approved by the customer. Do not fix it yourself.

## Steps

1. Open `src/_data/testimonials.json`. It is an array. It is empty until the first real testimonial.
2. Add an object with the approved text copied exactly:

   ```json
   {
     "quote": "The exact approved wording, character for character.",
     "name": "Full name",
     "role": "Job title",
     "company": "Company name",
     "approvedOn": "2026-11-10"
   }
   ```

   | Field | Rule |
   | --- | --- |
   | `quote` | Exact approved wording. No quotation marks inside the value unless they are part of the text. |
   | `name`, `role`, `company` | As the customer approved them. |
   | `approvedOn` | Optional. Date of the written approval, `YYYY-MM-DD`. Record it whenever the owner knows it. |

3. Do not change any template. The testimonial section appears on its own when the file has entries.

## Verify

1. `npm run build` ends with no errors.
2. `npm run dev`. Find the testimonial section. Read the quote against the owner's approved text, word for word.
3. Check at 1440px and 375px wide.

## Report

Show the owner the published quote and remind them to keep the customer's written approval on file.
