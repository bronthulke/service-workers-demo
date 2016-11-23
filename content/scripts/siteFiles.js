/* jshint worker: true */
// We need to get the files for the site
// e.g., find . -type f \( ! -iname ".DS_Store" \) -follow -print|xargs ls -l -1
// Watch for garbage!
// watch for defaults "index.html"

"use strict";
const siteFiles = [
  "./",
  "./content/images/banner.jpg",
  "./content/css/style.css",
  "./content/scripts/lib/async.js",
  "./content/scripts/site.js",
];

