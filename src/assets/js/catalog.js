/**
 * Catalog page: search and filter the product cards that are already in the
 * HTML. Nothing is fetched. Cards are shown or hidden with the `hidden`
 * attribute, and the current filters are kept in the address bar so a
 * filtered view can be shared as a link:
 *   catalog.html?q=towel&sector=hospitality&category=Carts
 *   catalog.html#marine            (sector shortcut used by the footer)
 */
(function () {
  "use strict";

  /* ---- Search matching (pure functions, unit tested) ---- */

  /** Lower-case, trim and split a query into words. */
  function tokenize(query) {
    return String(query || "")
      .toLowerCase()
      .split(/[\s,;/]+/)
      .filter(Boolean);
  }

  /** Forms of a word to try, so "towels" finds "towel" and "glasses" finds "glass". */
  function variants(token) {
    var forms = [token];
    if (token.length > 3 && /s$/.test(token) && !/ss$/.test(token)) forms.push(token.slice(0, -1));
    if (token.length > 4 && /es$/.test(token)) forms.push(token.slice(0, -2));
    return forms;
  }

  /**
   * True when every word of the query appears somewhere in the haystack.
   * The haystack is a card's lower-case `data-search` string.
   */
  function matches(haystack, query) {
    var hay = String(haystack || "").toLowerCase();
    var squeezed = hay.replace(/[\s-]+/g, ""); // lets "keycard" find "key card"
    return tokenize(query).every(function (token) {
      return variants(token).some(function (form) {
        return hay.indexOf(form) !== -1 || squeezed.indexOf(form.replace(/-/g, "")) !== -1;
      });
    });
  }

  window.CatalogSearch = { tokenize: tokenize, matches: matches };
  if (typeof document === "undefined") return;

  /* ---- Page wiring ---- */

  var grid = document.getElementById("catalog-grid");
  var search = document.getElementById("catalog-search");
  var categorySelect = document.getElementById("catalog-category");
  var count = document.getElementById("catalog-count");
  var empty = document.getElementById("catalog-empty");
  var emptyTitle = document.getElementById("catalog-empty-title");
  if (!grid || !search || !categorySelect || !count || !empty) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-product]")).map(function (el) {
    return {
      el: el,
      sector: el.getAttribute("data-sector") || "",
      category: el.getAttribute("data-category") || "",
      search: el.getAttribute("data-search") || ""
    };
  });
  var sectorChips = Array.prototype.slice.call(document.querySelectorAll(".filter-sectors [data-sector]"));
  var categoryOptions = Array.prototype.slice.call(categorySelect.querySelectorAll("option[data-sector]"));
  var clearButtons = Array.prototype.slice.call(document.querySelectorAll("[data-clear-filters]"));

  /** "hospitality" -> "Hospitality", or "" when the slug is not a real sector. */
  function sectorFromSlug(slug) {
    var wanted = String(slug || "").toLowerCase();
    var chip = sectorChips.filter(function (c) {
      return wanted && (c.getAttribute("data-sector-slug") === wanted || c.getAttribute("data-sector").toLowerCase() === wanted);
    })[0];
    return chip ? chip.getAttribute("data-sector") : "";
  }

  function slugOf(sector) {
    var chip = sectorChips.filter(function (c) { return c.getAttribute("data-sector") === sector; })[0];
    return chip ? chip.getAttribute("data-sector-slug") || "" : "";
  }

  function categoryExists(category, sector) {
    return categoryOptions.some(function (o) {
      return o.value === category && (!sector || o.getAttribute("data-sector") === sector);
    });
  }

  /** Read the starting filters from ?q= &sector= &category= or a #sector hash. */
  function readUrl() {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (err) { params = null; }
    var hash = (window.location.hash || "").replace(/^#/, "");
    var sector = sectorFromSlug(params && params.get("sector")) || sectorFromSlug(hash);
    var category = (params && params.get("category")) || "";
    return {
      q: ((params && params.get("q")) || "").trim().slice(0, 80),
      sector: sector,
      category: categoryExists(category, sector) ? category : ""
    };
  }

  /** Keep the address bar in step with the filters. Must never throw. */
  function writeUrl(state) {
    try {
      var params = new URLSearchParams();
      if (state.q) params.set("q", state.q);
      if (state.sector) params.set("sector", slugOf(state.sector));
      if (state.category) params.set("category", state.category);
      var query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : ""));
    } catch (err) {
      /* Sandboxed previews and file:// pages can refuse history changes. Filtering still works. */
    }
  }

  function plural(n) { return n === 1 ? "product" : "products"; }

  function describe(state) {
    var parts = [];
    if (state.q) parts.push('"' + state.q + '"');
    if (state.category) parts.push(state.category);
    else if (state.sector) parts.push(state.sector);
    return parts.join(" in ");
  }

  function setCount(shown, state) {
    var active = Boolean(state.q || state.sector || state.category);
    count.textContent = "";
    var figure = document.createElement("span");
    figure.className = "data";
    figure.textContent = String(shown);
    if (!active) {
      count.append("Showing all ", figure, " products");
    } else {
      count.append(figure, " of " + cards.length + " " + plural(cards.length) + (describe(state) ? " for " + describe(state) : ""));
    }
  }

  /** Apply a filter state to the page. Returns the state actually applied. */
  function apply(state, options) {
    var shown = 0;
    cards.forEach(function (card) {
      var visible =
        (!state.sector || card.sector === state.sector) &&
        (!state.category || card.category === state.category) &&
        matches(card.search, state.q);
      card.el.hidden = !visible;
      if (visible) shown += 1;
    });

    sectorChips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("data-sector") === state.sector));
    });
    categoryOptions.forEach(function (option) {
      var allowed = !state.sector || option.getAttribute("data-sector") === state.sector;
      option.hidden = !allowed;
      option.disabled = !allowed;
    });
    categorySelect.value = state.category;
    if (search.value.trim() !== state.q && document.activeElement !== search) search.value = state.q;

    var active = Boolean(state.q || state.sector || state.category);
    clearButtons.forEach(function (button) { button.hidden = !active && !button.closest("#catalog-empty"); });
    setCount(shown, state);

    grid.hidden = shown === 0;
    empty.hidden = shown !== 0;
    if (shown === 0 && emptyTitle) {
      emptyTitle.textContent = describe(state) ? "No products match " + describe(state) : "No products match your search";
    }
    if (!options || options.url !== false) writeUrl(state);
    return state;
  }

  var current = apply(readUrl(), { url: false });
  if (current.q) search.value = current.q;

  function update(change) {
    current = apply({
      q: change.q !== undefined ? change.q : current.q,
      sector: change.sector !== undefined ? change.sector : current.sector,
      category: change.category !== undefined ? change.category : current.category
    });
  }

  search.addEventListener("input", function () { update({ q: search.value.trim() }); });
  search.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && search.value) { search.value = ""; update({ q: "" }); }
  });

  sectorChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var sector = chip.getAttribute("data-sector");
      update({ sector: sector, category: categoryExists(current.category, sector) ? current.category : "" });
    });
  });

  categorySelect.addEventListener("change", function () { update({ category: categorySelect.value }); });

  clearButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      search.value = "";
      update({ q: "", sector: "", category: "" });
      search.focus();
    });
  });

  /* Footer links such as catalog.html#marine, clicked while already on this page. */
  window.addEventListener("hashchange", function () {
    var sector = sectorFromSlug((window.location.hash || "").replace(/^#/, ""));
    if (sector) update({ sector: sector, category: "" });
  });
})();
