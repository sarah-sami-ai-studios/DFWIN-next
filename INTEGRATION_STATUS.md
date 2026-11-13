# DFWIN-next integration status

## Implemented in this starter package
- Kevin’s Eleventy design and source retained.
- Public site URL changed to Sarah’s DFWIN-next GitHub Pages path.
- Approved hero replacement inserted into existing layout.
- Google Analytics 4 base tag configured: G-W373V27LQF.
- Existing product pages, JSON catalog, sitemap, and AI-oriented files retained.

## NOT YET CONNECTED / MUST TEST BEFORE PRODUCTION
- Google Sheets catalog as the authoritative source and automated publishing. Current products.json remains source.
- RFQ direct receiver. Endpoint intentionally remains blank until the exact endpoint and payload are verified.
- Custom analytics events for catalog search, RFQ actions, and conversion. GA4 basic page tracking only is added.
- Live site build, deployment and full QA.

## Important RFQ warning
Current quote.js uses `fetch(..., {mode: "no-cors"})` and treats promise resolution as confirmation of receipt. A successful fetch promise with opaque response does NOT prove the Apps Script receiver accepted the request. Do not enable endpoint until a verifiable acknowledgment workflow is designed and tested.

## Publish
Upload extracted repository contents (including hidden `.github` folder) to an empty `DFWIN-next` repository. GitHub Settings > Pages > Build and deployment > Source: GitHub Actions. Check Actions for successful build/deployment.

## Original site
The existing `DFWIN-site` repository is not modified.
