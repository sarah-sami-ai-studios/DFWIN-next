/**
 * Behaviour shared by every page: mobile menu, the quote-list counter in the
 * header, "Add to quote list" buttons and the toast message.
 */
(function () {
  "use strict";
  var root = document.body.getAttribute("data-root") || "";

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") setMenu(false); });
    nav.addEventListener("click", function (event) { if (event.target.closest("a")) setMenu(false); });
  }

  /* ---- Header search: the magnifying glass opens a text field ---- */
  var search = document.querySelector("[data-site-search]");
  if (search) {
    var searchToggle = search.querySelector("[data-site-search-toggle]");
    var searchInput = search.querySelector("input");
    var setSearch = function (open) {
      search.classList.toggle("is-open", open);
      searchToggle.setAttribute("aria-expanded", String(open));
      searchInput.tabIndex = open ? 0 : -1;
      if (open) { setMenu(false); searchInput.focus(); }
    };
    searchToggle.addEventListener("click", function () {
      var open = search.classList.contains("is-open");
      if (!open) setSearch(true);
      else if (searchInput.value.trim()) search.submit();
      else setSearch(false);
    });
    search.addEventListener("submit", function (event) {
      if (!searchInput.value.trim()) { event.preventDefault(); searchInput.focus(); }
    });
    search.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { setSearch(false); searchToggle.focus(); }
    });
    document.addEventListener("click", function (event) {
      if (!search.contains(event.target) && !searchInput.value.trim()) setSearch(false);
    });
  }

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  var toastTimer;
  /** Show a short message at the bottom of the screen. */
  window.showToast = function (message, linkLabel, linkHref) {
    if (!toast) return;
    toast.textContent = message;
    if (linkLabel && linkHref) {
      var link = document.createElement("a");
      link.href = linkHref;
      link.textContent = linkLabel;
      toast.appendChild(link);
    }
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 4200);
  };

  /* ---- Quote list counter and add buttons ---- */
  function refresh() {
    var items = window.QuoteList.items();
    document.querySelectorAll("[data-quote-count]").forEach(function (el) {
      el.textContent = String(items.length);
      el.hidden = items.length === 0;
    });
    document.querySelectorAll("[data-quote-add]").forEach(function (button) {
      var added = items.some(function (i) { return i.id === button.getAttribute("data-quote-add"); });
      button.setAttribute("aria-pressed", String(added));
      button.textContent = added ? "In quote list" : "Add to quote list";
    });
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-quote-add]");
    if (!button) return;
    var id = button.getAttribute("data-quote-add");
    var name = button.getAttribute("data-name") || id;
    if (window.QuoteList.has(id)) {
      window.QuoteList.remove(id);
      window.showToast(name + " removed from your quote list.");
    } else {
      window.QuoteList.add(id, name);
      window.showToast(name + " added.", "Review quote list", root + "quote.html");
    }
  });

  window.QuoteList.onChange(refresh);
  refresh();
})();
