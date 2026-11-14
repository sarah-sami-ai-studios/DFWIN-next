// Eleventy configuration for the DFWin International website.
// Source lives in src/, the built site is written to _site/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ICON_DIR = path.join(here, "node_modules/@phosphor-icons/core/assets");

/** Number of folders between a page and the site root ("/products/x.html" -> 1). */
function depthOf(pageUrl = "/") {
  return Math.max(0, pageUrl.split("/").filter(Boolean).length - 1);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addWatchTarget("src/assets/");

  // {{ "catalog.html" | rel }} -> a link that works from any folder depth and from
  // any host path (GitHub Pages sub-folder, custom domain, local file preview).
  eleventyConfig.addFilter("rel", function (target = "") {
    const clean = String(target).replace(/^\//, "");
    return "../".repeat(depthOf(this.page?.url)) + clean;
  });

  // {{ "/catalog.html" | abs }} -> full URL using site.url, for canonical tags,
  // sitemap.xml, llms.txt and structured data.
  eleventyConfig.addFilter("abs", function (target = "") {
    const base = String(this.ctx?.site?.url || "").replace(/\/$/, "");
    return base + "/" + String(target).replace(/^\//, "");
  });

  // {% icon "arrow-right" %} inlines a Phosphor icon as SVG. Optional weight:
  // {% icon "anchor", "bold" %}. Browse names at https://phosphoricons.com
  eleventyConfig.addShortcode("icon", function (name, weight = "regular") {
    const file = weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`;
    const full = path.join(ICON_DIR, weight, file);
    if (!fs.existsSync(full)) {
      throw new Error(`Unknown icon "${name}" (${weight}). See https://phosphoricons.com`);
    }
    return fs
      .readFileSync(full, "utf8")
      .replace("<svg ", '<svg class="icon" aria-hidden="true" focusable="false" ');
  });

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("where", (list, key, value) =>
    (list || []).filter((item) => item[key] === value)
  );
  eleventyConfig.addFilter("limit", (list, n) => (list || []).slice(0, n));
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter("longDate", (value) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addGlobalData("buildDate", () => new Date().toISOString().slice(0, 10));
  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
