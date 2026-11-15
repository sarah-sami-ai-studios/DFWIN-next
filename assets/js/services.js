/**
 * How we work: turns the three steps into a scroll story.
 *
 * - The line between the steps fills as the visitor scrolls.
 * - The step nearest the middle of the screen is "active": its text is at
 *   full strength and, on wide screens, its photo shows in the fixed stage.
 *
 * Without JavaScript, or with reduced motion switched on, none of this runs
 * and the page is a plain list of three steps with their photos.
 */
(function () {
  "use strict";
  var story = document.querySelector("[data-story]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!story || reduce || !("IntersectionObserver" in window)) return;

  var chapters = Array.prototype.slice.call(story.querySelectorAll("[data-story-chapter]"));
  var shots = Array.prototype.slice.call(story.querySelectorAll("[data-story-shot]"));
  if (!chapters.length) return;

  document.documentElement.classList.add("story-live");
  story.classList.add("story--live");

  /** Marks one step active and every step up to it as reached. */
  function activate(index) {
    chapters.forEach(function (chapter, i) {
      chapter.classList.toggle("is-active", i === index);
      if (i <= index) chapter.classList.add("is-reached");
    });
    shots.forEach(function (shot, i) {
      shot.classList.toggle("is-active", i === index);
    });
  }

  /** The step whose middle is closest to the middle of the screen. */
  function nearestIndex() {
    var middle = window.innerHeight / 2;
    var best = 0;
    var bestDistance = Infinity;
    chapters.forEach(function (chapter, i) {
      var box = chapter.getBoundingClientRect();
      var distance = Math.abs(box.top + box.height / 2 - middle);
      if (distance < bestDistance) { bestDistance = distance; best = i; }
    });
    return best;
  }

  /** How far the middle of the screen has travelled down the story, 0 to 1. */
  function progress() {
    var box = story.getBoundingClientRect();
    if (!box.height) return 0;
    var value = (window.innerHeight * 0.55 - box.top) / box.height;
    return Math.min(1, Math.max(0, value));
  }

  var queued = false;
  function update() {
    queued = false;
    var box = story.getBoundingClientRect();
    story.style.setProperty("--progress", progress().toFixed(4));
    // Nothing is active until the story is on screen.
    if (box.top < window.innerHeight * 0.85) activate(nearestIndex());
  }
  function requestUpdate() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
