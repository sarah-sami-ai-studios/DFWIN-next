---
name: connect-quote-form
description: Explains how the DFWin quote form delivers requests and connects it to a form backend so requests arrive automatically in a Google Sheet and the sales inbox. Use when the owner asks to receive quote requests automatically, connect or fix the quote form, set up form submissions, or asks where quote requests go. Run with /connect-quote-form.
---

# Connect the quote form

## How the form works today

Code: `src/quote.njk` and `src/assets/js/quote.js`. Setting: `quote.endpoint` in `src/_data/site.json`.

- **`quote.endpoint` is empty (the default).** Nothing is sent by the site. The visitor gets their request as text, with a button that opens it in their own email app addressed to `email.sales`, and a copy button. The page says "Your request is ready", never "sent".
- **`quote.endpoint` is a URL.** The button reads "Send request". The site POSTs the request to that URL. When the POST completes, the page says "Request sent" and clears the quote list. If the network fails, the visitor is shown the email option instead.

What the site sends, exactly (read `send()` in `quote.js` to confirm it has not changed):

- Method `POST`, `mode: "no-cors"`, header `Content-Type: text/plain;charset=UTF-8`.
- Body: one JSON string with these fields:

```json
{
  "requestType": "Quote for catalog products",
  "company": "", "name": "", "email": "", "phone": "", "country": "",
  "siteName": "", "neededBy": "2027-01-15", "details": "",
  "items": [{ "id": "HOSP-0049", "name": "Product name", "qty": 10 }],
  "summary": "The whole request as plain text",
  "page": "https://.../quote.html",
  "sentAt": "2026-11-10T09:00:00.000Z"
}
```

Two consequences:

1. The backend must accept a `text/plain` body and parse it as JSON. Google Apps Script does. Most form services do not, see Option B.
2. Because of `no-cors`, the browser cannot read the reply. The page shows "Request sent" whenever the POST reaches the server, even if the server then rejects it. So a wrong or broken endpoint loses requests silently. Always test end to end after any change.

## Option A (recommended): Google Apps Script, Google Sheet and email

Free, no code change on the site, requests are logged in a Sheet and emailed to sales. The owner does these steps in their own Google account. Guide them one step at a time.

1. Create a Google Sheet named "DFWin quote requests". Copy its ID from the address bar: the long text between `/d/` and `/edit`.
2. In the Sheet: Extensions, then Apps Script. Delete the sample code. Paste the script below.
3. Set `SHEET_ID` and `NOTIFY_EMAIL` at the top.
4. Choose the function `testDoPost` in the toolbar and click Run. Approve the permission prompts. A test row appears in the Sheet and a test email arrives.
5. Click Deploy, then New deployment. Type: Web app. Execute as: Me. Who has access: Anyone. Click Deploy. Copy the Web app URL. It ends in `/exec`.
6. Put that URL in `src/_data/site.json`:

   ```json
   "quote": { "endpoint": "https://script.google.com/macros/s/XXXX/exec", "responseTime": "one business day" }
   ```

   This URL is public by design. It is not a secret and is safe to commit.
7. Build, test (see Verify), commit and deploy.

**Redeploy after every script edit.** Saving the script does not update the live web app. Go to Deploy, then Manage deployments, click the pencil, set Version to "New version", then Deploy. The URL stays the same. If you create a "New deployment" instead, the URL changes and `site.json` must be updated.

```js
/**
 * DFWin quote form receiver.
 * Receives the JSON the website sends, appends a row to a Google Sheet
 * and emails the request to sales.
 */
const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
const SHEET_NAME = "Requests";
const NOTIFY_EMAIL = "sales@example.com"; // where requests are emailed

const HEADERS = [
  "Received", "Request type", "Company", "Name", "Email", "Phone", "Country",
  "Vessel or property", "Needed by", "Products", "Details", "Page", "Sent at"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Ignore empty or malformed posts.
    const email = clean(data.email, 160);
    if (!clean(data.company, 120) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return reply({ ok: false, error: "Missing company or valid email" });
    }

    const items = (Array.isArray(data.items) ? data.items : []).slice(0, 200);
    const products = items
      .map(function (item) { return clean(item.id, 20) + "  " + clean(item.name, 120) + "  x " + (parseInt(item.qty, 10) || 1); })
      .join("\n");

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      safeCell(clean(data.requestType, 80)),
      safeCell(clean(data.company, 120)),
      safeCell(clean(data.name, 120)),
      safeCell(email),
      safeCell(clean(data.phone, 40)),
      safeCell(clean(data.country, 80)),
      safeCell(clean(data.siteName, 120)),
      safeCell(clean(data.neededBy, 20)),
      safeCell(products),
      safeCell(clean(data.details, 4000)),
      safeCell(clean(data.page, 300)),
      safeCell(clean(data.sentAt, 40))
    ]);

    const summary = clean(data.summary, 8000) || products;
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: "Quote request from " + clean(data.company, 120),
      body: summary + "\n\nSent from: " + clean(data.page, 300)
    });

    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser shows this, which proves it is deployed.
function doGet() {
  return reply({ ok: true, service: "DFWin quote form receiver" });
}

function getSheet() {
  const book = SpreadsheetApp.openById(SHEET_ID);
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

// Stops text that starts with = + - or @ from being run as a spreadsheet formula.
function safeCell(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor to grant permissions and check the Sheet and email.
function testDoPost() {
  const sample = {
    requestType: "Quote for catalog products",
    company: "Test Company", name: "Test Person", email: "test@example.com",
    phone: "+1 305 555 0100", country: "United States", siteName: "Test Vessel",
    neededBy: "2027-01-15", details: "This is a test. Please ignore.",
    items: [{ id: "HOSP-0001", name: "Test product", qty: 10 }],
    summary: "Test quote request. Please ignore.",
    page: "https://example.com/quote.html", sentAt: new Date().toISOString()
  };
  const result = doPost({ postData: { contents: JSON.stringify(sample) } });
  console.log(result.getContent());
}
```

Limits to tell the owner: a free Google account can send about 100 emails a day from Apps Script. The Sheet is the record if an email is missed. Spam is possible on any public form. The site has a hidden trap field, and the script rejects posts without a company and a valid email.

## Option B: Formspree, Web3Forms or a similar form service

These services expect a form-encoded or `application/json` request, and Web3Forms also needs an `access_key` field in the body. The site's current `text/plain`, `no-cors` request will not be accepted as it is. Choosing one of these means changing `send()` in `src/assets/js/quote.js`:

- Send `headers: { "Content-Type": "application/json", "Accept": "application/json" }` and remove `mode: "no-cors"`.
- Check `response.ok` before showing "Request sent". Show the error state otherwise.
- Flatten `items` to text (the `summary` field already holds the whole request).
- For Web3Forms, add the access key to the payload. That key is designed to be public.

Ask the owner before changing `quote.js`. Check the service's current documentation for field names and free plan limits. Do not rely on memory.

## Turning it off

Set `"endpoint": ""` in `src/_data/site.json`, build and deploy. The form goes back to preparing an email.

## Verify

1. `npm run build` ends with no errors. `npm run dev`.
2. Open `quote.html`. The button reads "Send request".
3. Tell the owner a real test is about to be sent. Add two products, fill the form with test details, and submit.
4. The page shows "Request sent" and the quote list is empty.
5. The owner confirms both: a new row in the Sheet, and an email in the sales inbox with the right products and quantities. Replying to that email addresses the test visitor's email.
6. If the page says "sent" but nothing arrived: open the endpoint URL in a browser (it should show `{"ok":true,...}`), check Executions in the Apps Script editor for errors, and confirm the deployment was updated to a new version.
7. Deploy, then repeat the test on the live site. Only then tell the owner it is connected.
8. Update the "quote form endpoint is not connected yet" line in `PRODUCT.md`.
