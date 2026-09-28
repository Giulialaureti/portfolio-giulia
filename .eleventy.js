module.exports = function (eleventyConfig) {
  // The existing hand-written site is copied through untouched — Eleventy
  // only templates the blog (see blog-src/). This keeps every already-tuned
  // page byte-for-byte identical to what it was before the CMS was added.
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "profilo.html": "profilo.html" });
  eleventyConfig.addPassthroughCopy({ "progetti.html": "progetti.html" });
  eleventyConfig.addPassthroughCopy({ "404.html": "404.html" });
  eleventyConfig.addPassthroughCopy({ "progetti": "progetti" });

  eleventyConfig.addFilter("formatDateIt", function (dateObj) {
    return new Date(dateObj).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  return {
    dir: {
      input: "blog-src",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
