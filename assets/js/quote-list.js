/**
 * Quote list: the products a visitor wants priced. Stored in the visitor's own
 * browser (localStorage), so it survives moving between pages. No server needed.
 *
 * Other scripts use the global `QuoteList` object:
 *   QuoteList.items()            -> [{ id, name, qty }]
 *   QuoteList.add(id, name)      QuoteList.remove(id)
 *   QuoteList.setQty(id, qty)    QuoteList.clear()
 *   QuoteList.has(id)            QuoteList.onChange(callback)
 */
(function () {
  "use strict";
  var KEY = "dfwin.quoteList.v1";
  var listeners = [];
  var memory = [];

  /** @returns {Array<{id: string, name: string, qty: number}>} */
  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(function (i) { return i && i.id; }) : [];
    } catch (err) {
      return memory.slice();
    }
  }

  function write(items) {
    memory = items.slice();
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch (err) {
      /* Storage unavailable (private window). The in-memory copy still works for this page. */
    }
    listeners.forEach(function (fn) { fn(items.slice()); });
  }

  function clampQty(qty) {
    var n = parseInt(qty, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 999999);
  }

  window.QuoteList = {
    items: read,
    has: function (id) { return read().some(function (i) { return i.id === id; }); },
    add: function (id, name) {
      var items = read();
      if (items.some(function (i) { return i.id === id; })) return;
      write(items.concat([{ id: id, name: name, qty: 1 }]));
    },
    remove: function (id) { write(read().filter(function (i) { return i.id !== id; })); },
    setQty: function (id, qty) {
      write(read().map(function (i) { return i.id === id ? { id: i.id, name: i.name, qty: clampQty(qty) } : i; }));
    },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); }
  };

  window.addEventListener("storage", function (event) {
    if (event.key === KEY) listeners.forEach(function (fn) { fn(read()); });
  });
})();
