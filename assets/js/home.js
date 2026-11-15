/**
 * Home page: the figures under the hero count up to their real value on load.
 * The real values are already in the HTML, so with animation switched off
 * (or JavaScript unavailable) the page simply shows them.
 */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll("[data-count]");
  if (reduce || !items.length || !window.requestAnimationFrame) return;

  var DURATION = 1400;

  /** Ease-out so the number settles gently on its final value. */
  function ease(t) { return 1 - Math.pow(1 - t, 4); }

  items.forEach(function (el, index) {
    var finalText = el.textContent.trim();
    var target = parseInt(finalText.replace(/[^0-9]/g, ""), 10);
    if (isNaN(target)) return;
    var grouped = finalText.indexOf(",") !== -1;
    /* A year counts up from a nearby year, not from zero. */
    var from = !grouped && target > 1900 && target < 2100 ? target - 24 : 0;
    var start = null;
    var delay = index * 90;

    function format(n) { return grouped ? n.toLocaleString("en-US") : String(n); }

    el.textContent = format(from);
    function frame(now) {
      if (start === null) start = now + delay;
      var t = Math.min(Math.max((now - start) / DURATION, 0), 1);
      el.textContent = t === 1 ? finalText : format(Math.round(from + (target - from) * ease(t)));
      if (t < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  });
})();
