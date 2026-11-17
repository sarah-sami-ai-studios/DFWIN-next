/**
 * Request a quote page.
 *
 * 1. Shows the visitor's quote list (from quote-list.js) with quantity
 *    controls and a remove button per product.
 * 2. Validates the form and turns it into a plain-text request.
 * 3. Delivers the request:
 *    - If site.json has quote.endpoint set, the request is POSTed there and a
 *      "sent" message is shown once the POST completes.
 *    - Otherwise the visitor gets the request text to copy, plus a link that
 *      opens it in their email app. The page never says "sent" in this case,
 *      because nothing has been sent.
 */
(function () {
  "use strict";

  var MAILTO_BODY_LIMIT = 1800; // long mailto: links are cut off by some email apps
  var QTY_MAX = 999999;
  var pendingRequestId = null;

  var body = document.body;
  var root = body.getAttribute("data-root") || "";
  var endpoint = (body.dataset.quoteEndpoint || "").trim();
  var salesEmail = (body.dataset.salesEmail || "").trim();
  var QuoteList = window.QuoteList;

  function $(id) { return document.getElementById(id); }

  var compose = $("quote-compose");
  var form = $("quote-form");
  var listEl = $("quote-items");
  var template = $("quote-item-template");
  if (!compose || !form || !listEl || !template || !QuoteList) return;

  /** Product lookup embedded in the page: { "HOSP-0049": { name, image, slug } } */
  var productIndex = {};
  try {
    productIndex = JSON.parse($("product-index").textContent) || {};
  } catch (err) {
    productIndex = {}; // rows still render from the stored name, without photo or link
  }

  /* ====================================================== quote list ==== */

  var listCount = $("list-count");
  var listEmpty = $("list-empty");
  var listMore = $("list-more");
  var listClear = $("list-clear");
  var listConfirm = $("list-confirm");
  var listStatus = $("list-status");
  var listTitle = $("list-title");
  var detailsRequiredMark = $("details-required");
  var detailsOptionalMark = $("details-optional");

  function clampQty(value) {
    var n = parseInt(value, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, QTY_MAX);
  }

  function announce(message) { if (listStatus) listStatus.textContent = message; }

  function part(row, name) { return row.querySelector('[data-part="' + name + '"]'); }

  function buildRow(item) {
    var row = template.content.firstElementChild.cloneNode(true);
    var known = productIndex[item.id];
    var name = (known && known.name) || item.name || item.id;
    var href = known ? root + "products/" + known.slug + ".html" : "";
    row.setAttribute("data-id", item.id);

    var thumbLink = part(row, "thumb-link");
    var nameLink = part(row, "name");
    if (known) {
      thumbLink.href = href;
      part(row, "thumb").src = root + known.image;
      nameLink.href = href;
    } else {
      part(row, "thumb").remove();
      thumbLink.removeAttribute("href");
      nameLink.removeAttribute("href");
    }
    nameLink.textContent = name;
    part(row, "id").textContent = item.id;

    var qty = part(row, "qty");
    qty.id = "qty-" + item.id;
    qty.value = String(clampQty(item.qty));
    qty.setAttribute("aria-label", "Quantity of " + name);
    part(row, "stepper").setAttribute("role", "group");
    part(row, "stepper").setAttribute("aria-label", "Quantity of " + name);
    part(row, "minus").setAttribute("aria-label", "Decrease quantity of " + name);
    part(row, "plus").setAttribute("aria-label", "Increase quantity of " + name);

    var remove = part(row, "remove");
    remove.setAttribute("aria-label", "Remove " + name + " from your quote list");
    remove.title = "Remove";
    return row;
  }

  /** Redraw the list. When only quantities changed, rows are kept so focus is not lost. */
  function renderList() {
    var items = QuoteList.items();
    var rows = Array.prototype.slice.call(listEl.children);
    var sameRows = rows.length === items.length && items.every(function (item, i) {
      return rows[i].getAttribute("data-id") === item.id;
    });

    if (sameRows) {
      items.forEach(function (item, i) {
        var qty = part(rows[i], "qty");
        if (document.activeElement !== qty) qty.value = String(clampQty(item.qty));
        part(rows[i], "minus").disabled = clampQty(item.qty) <= 1;
      });
    } else {
      listEl.textContent = "";
      items.forEach(function (item) {
        var row = buildRow(item);
        part(row, "minus").disabled = clampQty(item.qty) <= 1;
        listEl.appendChild(row);
      });
    }

    var has = items.length > 0;
    listEl.hidden = !has;
    listEmpty.hidden = has;
    listMore.hidden = !has;
    listClear.hidden = !has;
    if (!has) listConfirm.hidden = true;
    listCount.hidden = !has;
    listCount.textContent = has ? String(items.length) : "";
    listCount.setAttribute("aria-label", has ? "(" + items.length + (items.length === 1 ? " product)" : " products)") : "");

    /* The details box is only required when there are no products to quote. */
    detailsRequiredMark.hidden = has;
    detailsOptionalMark.hidden = !has;
    if (has) setFieldError(fieldsById.details, false);
  }

  listEl.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    var row = event.target.closest(".quote-item");
    if (!button || !row) return;
    var id = row.getAttribute("data-id");
    var name = part(row, "name").textContent;
    var qty = part(row, "qty");
    var action = button.getAttribute("data-part");

    if (action === "minus" || action === "plus") {
      var next = clampQty(clampQty(qty.value) + (action === "plus" ? 1 : -1));
      qty.value = String(next);
      QuoteList.setQty(id, next);
      if (button.disabled) part(row, "plus").focus(); // minus just disabled itself at 1
      return;
    }
    if (action === "remove") {
      var rows = Array.prototype.slice.call(listEl.children);
      var index = rows.indexOf(row);
      QuoteList.remove(id);
      announce(name + " removed from your quote list.");
      var remaining = listEl.children;
      var target = remaining[Math.min(index, remaining.length - 1)];
      if (target) part(target, "remove").focus();
      else listTitle.focus();
    }
  });

  listEl.addEventListener("change", function (event) {
    var row = event.target.closest(".quote-item");
    if (!row || event.target.getAttribute("data-part") !== "qty") return;
    var next = clampQty(event.target.value);
    event.target.value = String(next);
    QuoteList.setQty(row.getAttribute("data-id"), next);
  });

  /* Clear list, with a confirm step in the page (no browser dialog). */
  listClear.addEventListener("click", function () {
    listConfirm.hidden = false;
    listClear.hidden = true;
    $("list-confirm-no").focus();
  });
  $("list-confirm-no").addEventListener("click", function () {
    listConfirm.hidden = true;
    listClear.hidden = false;
    listClear.focus();
  });
  $("list-confirm-yes").addEventListener("click", function () {
    QuoteList.clear();
    announce("Your quote list is now empty.");
    $("list-empty-link").focus();
  });

  /* ====================================================== validation ==== */

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /** Each rule returns true when the value is acceptable. */
  var rules = {
    company: function (v) { return v.length > 0; },
    "full-name": function (v) { return v.length > 0; },
    email: function (v) { return EMAIL_PATTERN.test(v); },
    phone: function (v) { return v === "" || (/^[+()\d\s.\-]+$/.test(v) && v.replace(/\D/g, "").length >= 6); },
    "needed-by": function (v, input) { return !input.validity.badInput && (v === "" || v >= todayIso()); },
    details: function (v) { return v.length > 0 || QuoteList.items().length > 0; }
  };

  var fieldsById = {};
  Object.keys(rules).forEach(function (id) { fieldsById[id] = $(id); });

  function setFieldError(input, invalid) {
    if (!input) return;
    var field = input.closest(".field");
    if (field) field.classList.toggle("is-invalid", invalid);
    if (invalid) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validateField(id) {
    var input = fieldsById[id];
    if (!input) return true;
    var ok = rules[id](input.value.trim(), input);
    setFieldError(input, !ok);
    return ok;
  }

  Object.keys(rules).forEach(function (id) {
    var input = fieldsById[id];
    if (!input) return;
    input.addEventListener("blur", function () { validateField(id); });
    /* Once a field is marked wrong, clear the message as soon as it is fixed. */
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(id);
    });
  });

  var neededBy = fieldsById["needed-by"];
  if (neededBy) neededBy.min = todayIso();

  /* ================================================= request building ==== */

  function value(id) { var el = $(id); return el ? el.value.trim() : ""; }

  /** Everything the visitor entered, as one plain object. */
  function collect() {
    var type = form.querySelector('input[name="requestType"]');
    return {
      requestType: type ? type.value : "Quote for catalog products",
      company: value("company"),
      name: value("full-name"),
      email: value("email"),
      phone: value("phone"),
      country: value("country"),
      siteName: value("site-name"),
      neededBy: value("needed-by"),
      details: value("details"),
      items: QuoteList.items().map(function (item) {
        var known = productIndex[item.id];
        return { id: item.id, name: (known && known.name) || item.name || item.id, qty: clampQty(item.qty) };
      })
    };
  }

  /** The request as plain text, ready to paste into an email. */
  function buildSummary(data) {
    var lines = ["Quote request for DFWin International", "", "Request type: " + data.requestType, ""];
    lines.push("Company: " + data.company, "Name: " + data.name, "Email: " + data.email);
    if (data.phone) lines.push("Phone: " + data.phone);
    if (data.country) lines.push("Country: " + data.country);
    if (data.siteName) lines.push("Vessel or property: " + data.siteName);
    if (data.neededBy) lines.push("Needed by: " + data.neededBy);
    if (data.items.length) {
      lines.push("", "Products (" + data.items.length + "):");
      data.items.forEach(function (item, i) {
        lines.push(i + 1 + ". " + item.id + "  " + item.name + "  x " + item.qty);
      });
    }
    if (data.details) lines.push("", "Details:", data.details);
    return lines.join("\n");
  }

  function buildMailto(data, summary) {
    var truncated = summary.length > MAILTO_BODY_LIMIT;
    var text = truncated
      ? summary.slice(0, MAILTO_BODY_LIMIT).replace(/\s+\S*$/, "") + "\n\n[Shortened. The full request is pasted below.]\n"
      : summary;
    var subject = (data.requestType === "Quote for catalog products" ? "Quote request" : "Customer inquiry") + " from " + data.company;
    return {
      href: "mailto:" + salesEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text.replace(/\n/g, "\r\n")),
      truncated: truncated
    };
  }

  /* ==================================================== result states ==== */

  var result = $("quote-result");
  var resultTitle = $("result-title");
  var resultLede = $("result-lede");
  var resultFallback = $("result-fallback");
  var resultSummary = $("result-summary");
  var resultMailto = $("result-mailto");
  var resultTruncated = $("result-truncated");
  var resultEdit = $("result-edit");
  var copyStatus = $("copy-status");
  var submit = $("quote-submit");
  var formError = $("form-error");
  var submitLabel = submit.innerHTML;

  if (endpoint) submit.firstChild.textContent = "Send request ";

  /** state: "ready" (nothing sent yet), "sent" (endpoint accepted it), "error" (endpoint failed). */
  function showResult(state, data, summary) {
    var showFallback = state !== "sent";
    if (state === "ready") {
      resultTitle.textContent = "Your request is ready";
      resultLede.textContent = "It has not been sent yet. Send it to our sales team in one of the two ways below.";
    } else if (state === "error") {
      resultTitle.textContent = "We could not send your request";
      resultLede.textContent = "We could not confirm receipt. Your details are preserved. Please contact our team by email instead; if you already received a reference number, mention it to avoid a duplicate.";
    } else {
      resultTitle.textContent = "Request sent";
      resultLede.textContent = "Thank you, " + data.name + ". Your reference is " + (data.confirmedReference || "confirmed") + ". Our team will reply to " + data.email + ".";
    }
    resultFallback.hidden = !showFallback;
    resultEdit.hidden = state === "sent";
    if (showFallback) {
      var mail = buildMailto(data, summary);
      resultSummary.value = summary;
      resultMailto.href = mail.href;
      resultTruncated.hidden = !mail.truncated;
      copyStatus.textContent = "";
    }
    result.setAttribute("data-state", state);
    compose.hidden = true;
    result.hidden = false;
    resultTitle.focus();
    result.scrollIntoView({ block: "start" });
  }

  function showCompose(focusTarget) {
    result.hidden = true;
    compose.hidden = false;
    if (focusTarget) focusTarget.focus();
  }

  function resetForm() {
    form.reset();
    Object.keys(fieldsById).forEach(function (id) { setFieldError(fieldsById[id], false); });
    formError.hidden = true;
  }

  function setBusy(busy) {
    submit.disabled = busy;
    if (busy) submit.textContent = "Sending";
    else {
      submit.innerHTML = submitLabel;
      if (endpoint) submit.firstChild.textContent = "Send request ";
    }
  }

  /* Cross-origin Apps Script responses cannot be read using no-cors fetch.
   * Submit through a hidden form, then independently verify receipt through a
   * JSONP status check. A timeout is NOT evidence the request failed.
   */
  function makeRequestId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var bytes = new Uint8Array(16);
    if (!window.crypto || !crypto.getRandomValues) throw new Error("Secure random IDs unavailable");
    crypto.getRandomValues(bytes);
    return Array.from(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function statusCheck(requestId) {
    return new Promise(function (resolve, reject) {
      var callback = "dfwStatus_" + Math.random().toString(36).slice(2);
      var script = document.createElement("script");
      var done = false;
      var timer = setTimeout(function () { finish(new Error("Status check timed out")); }, 9000);
      function finish(err, data) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        delete window[callback];
        script.remove();
        if (err) reject(err); else resolve(data);
      }
      window[callback] = function (data) { finish(null, data); };
      script.onerror = function () { finish(new Error("Status check unavailable")); };
      script.src = endpoint + "?action=status&requestId=" + encodeURIComponent(requestId) + "&callback=" + callback;
      document.head.appendChild(script);
    });
  }

  function postForm(payload) {
    var iframe = document.createElement("iframe");
    var targetName = "dfw_submit_" + Math.random().toString(36).slice(2);
    iframe.name = targetName;
    iframe.title = "Inquiry submission";
    iframe.hidden = true;
    var post = document.createElement("form");
    post.method = "POST";
    post.action = endpoint;
    post.target = targetName;
    post.style.display = "none";
    var input = document.createElement("input");
    input.name = "payload";
    input.value = JSON.stringify(payload);
    post.appendChild(input);
    document.body.appendChild(iframe);
    document.body.appendChild(post);
    post.submit();
    setTimeout(function () { post.remove(); iframe.remove(); }, 60000);
  }

  function send(data, summary) {
    setBusy(true);
    if (!pendingRequestId) pendingRequestId = makeRequestId();
    var isCatalog = data.requestType === "Quote for catalog products";
    var inquiryType = isCatalog && data.items.length ? "Catalog RFQ" :
      (data.requestType === "Have a product made or sourced" ? "New Product Development" : "General Inquiry");
    var extra = [data.details, data.country && "Country: " + data.country,
      data.siteName && "Vessel/property: " + data.siteName,
      data.neededBy && "Needed by: " + data.neededBy].filter(Boolean).join("\n");
    var payload = {
      requestId: pendingRequestId,
      inquiryType: inquiryType,
      customer: { name: data.name, company: data.company, email: data.email, phone: data.phone },
      products: data.items.map(function (item) { return { id: item.id, name: item.name, quantity: item.qty }; }),
      notes: extra,
      subject: data.requestType,
      message: extra || data.requestType,
      website: value("website")
    };
    try { postForm(payload); }
    catch (err) { setBusy(false); showResult("error", data, summary); return; }
    var attempts = 0;
    function poll() {
      attempts++;
      statusCheck(pendingRequestId).then(function (answer) {
        if (answer && answer.found && answer.referenceNumber) {
          data.confirmedReference = answer.referenceNumber;
          pendingRequestId = null;
          QuoteList.clear();
          resetForm();
          showResult("sent", data, summary);
          if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { inquiry_type: inquiryType });
          setBusy(false);
        } else if (attempts < 7) {
          setTimeout(poll, 2200);
        } else {
          setBusy(false);
          showResult("error", data, summary);
        }
      }).catch(function () {
        if (attempts < 7) setTimeout(poll, 2200);
        else { setBusy(false); showResult("error", data, summary); }
      });
    }
    setTimeout(poll, 1400);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (value("website")) return; // spam trap was filled in: a bot, not a buyer

    var invalid = Object.keys(rules).filter(function (id) { return !validateField(id); });
    if (!QuoteList.items().length) {
      formError.textContent = "Please add at least one catalog product before requesting a quotation.";
      formError.hidden = false;
      $("list-empty-link").focus();
      return;
    }
    if (invalid.length) {
      $("manual-email-option").hidden = false;
      formError.textContent = invalid.length === 1
        ? "One field needs your attention before we can prepare the request."
        : invalid.length + " fields need your attention before we can prepare the request.";
      formError.hidden = false;
      fieldsById[invalid[0]].focus();
      return;
    }
    formError.hidden = true;
    $("manual-email-option").hidden = true;

    var data = collect();
    var summary = buildSummary(data);
    if (endpoint) send(data, summary);
    else showResult("ready", data, summary);
  });

  form.addEventListener("input", function () { pendingRequestId = null; });
  listEl.addEventListener("change", function () { pendingRequestId = null; });
  listEl.addEventListener("click", function () { pendingRequestId = null; });

  $("manual-email-option").addEventListener("click", function () {
    var data = collect();
    showResult("ready", data, buildSummary(data));
  });

  /* Copy request. The clipboard call stays inside the click handler, and if the
     browser refuses it the text is selected so the visitor can copy by hand. */
  function selectSummary() {
    resultSummary.focus();
    resultSummary.select();
    copyStatus.textContent = "Text selected. Press Ctrl+C or Cmd+C to copy.";
  }
  $("result-copy").addEventListener("click", function () {
    var text = resultSummary.value;
    if (!navigator.clipboard || !navigator.clipboard.writeText) { selectSummary(); return; }
    navigator.clipboard.writeText(text).then(function () {
      copyStatus.textContent = "Copied. Paste it into an email to " + salesEmail + ".";
    }).catch(selectSummary);
  });

  resultEdit.addEventListener("click", function () { showCompose($("form-title").closest("section").querySelector("input:checked")); });

  $("result-new").addEventListener("click", function () {
    QuoteList.clear();
    resetForm();
    showCompose(null);
    listTitle.focus();
    window.scrollTo(0, 0);
  });

  QuoteList.onChange(renderList);
  renderList();
})();
