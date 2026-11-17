(function () {
  "use strict";
  var form = document.getElementById("inquiry-form");
  if (!form) return;
  var endpoint = document.body.dataset.quoteEndpoint || "";
  var salesEmail = document.body.dataset.salesEmail || "";
  var product = form.dataset.inquiryType === "New Product Development";
  var pendingId = null;
  var button = document.getElementById("inquiry-submit");
  var status = document.getElementById("inquiry-status");
  function field(name) { return form.elements.namedItem(name).value.trim(); }
  function track(name, params) { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); }
  track("inquiry_form_view", { inquiry_type: product ? "New Product Development" : "General Inquiry" });
  function id() {
    if (crypto.randomUUID) return crypto.randomUUID();
    var bytes = new Uint8Array(16); crypto.getRandomValues(bytes);
    return Array.from(bytes, function (n) { return n.toString(16).padStart(2, "0"); }).join("");
  }
  function post(payload) {
    var frame = document.createElement("iframe"); frame.name = "dfw_" + id().replace(/-/g, ""); frame.hidden = true; frame.title = "Inquiry submission";
    var post = document.createElement("form"); post.method = "POST"; post.action = endpoint; post.target = frame.name; post.style.display = "none";
    var input = document.createElement("input"); input.name = "payload"; input.value = JSON.stringify(payload); post.appendChild(input);
    document.body.appendChild(frame); document.body.appendChild(post); post.submit();
    setTimeout(function () { post.remove(); frame.remove(); }, 60000);
  }
  function check(requestId) {
    return new Promise(function (resolve, reject) {
      var cb = "dfwStatus_" + id().replace(/-/g, "");
      var script = document.createElement("script"); var done = false;
      var timer = setTimeout(function () { finish(new Error("Timeout")); }, 9000);
      function finish(error, value) { if (done) return; done = true; clearTimeout(timer); delete window[cb]; script.remove(); error ? reject(error) : resolve(value); }
      window[cb] = function (data) { finish(null, data); };
      script.onerror = function () { finish(new Error("Unavailable")); };
      script.src = endpoint + "?action=status&requestId=" + encodeURIComponent(requestId) + "&callback=" + cb;
      document.head.appendChild(script);
    });
  }
  form.addEventListener("input", function () { pendingId = null; });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (field("website")) return;
    if (!form.reportValidity()) return;
    if (!pendingId) pendingId = id();
    var inquiryType = product ? "New Product Development" : "General Inquiry";
    var message = field("message");
    if (product) message += "\n\nEstimated quantity: " + (field("quantity") || "Not specified") + "\nTarget delivery: " + (field("targetDate") || "Not specified") + "\nSpecifications: " + (field("specifications") || "Not specified");
    var payload = { requestId: pendingId, inquiryType: inquiryType,
      customer: { name: field("name"), company: field("company"), email: field("email"), phone: field("phone") },
      subject: field("subject"), message: message, products: [], notes: message };
    var emailText = "Inquiry type: " + inquiryType + "\nCompany: " + field("company") + "\nName: " + field("name") + "\nEmail: " + field("email") + "\nPhone: " + field("phone") + "\nSubject: " + field("subject") + "\n\n" + message;
    document.getElementById("inquiry-email").href = "mailto:" + salesEmail + "?subject=" + encodeURIComponent(field("subject")) + "&body=" + encodeURIComponent(emailText);
    button.disabled = true; status.textContent = "Submitting and checking receipt…";
    document.getElementById("inquiry-fallback").hidden = true;
    if (!endpoint) { fail(); return; }
    try { post(payload); } catch (error) { fail(); return; }
    var attempts = 0;
    function fail() { button.disabled = false; status.textContent = "Receipt not confirmed. You can try again or use the email option below."; document.getElementById("inquiry-fallback").hidden = false; }
    function poll() {
      attempts++;
      check(pendingId).then(function (response) {
        if (response && response.found && response.referenceNumber) {
          document.getElementById("inquiry-reference").textContent = "Your reference number is " + response.referenceNumber + ". We will follow up using the email you provided.";
          form.hidden = true; document.getElementById("inquiry-success").hidden = false; document.getElementById("inquiry-success").focus();
          track("generate_lead", { inquiry_type: inquiryType }); pendingId = null;
        } else if (attempts < 7) setTimeout(poll, 2200); else fail();
      }).catch(function () { if (attempts < 7) setTimeout(poll, 2200); else fail(); });
    }
    setTimeout(poll, 1400);
  });
})();
