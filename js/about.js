/* global initHeader */
document.querySelectorAll("include[src]").forEach(async (el) => {
  el.outerHTML = await (await fetch(el.getAttribute("src"))).text();

  if (el.getAttribute("src") === "../../src/html/header.html") {
    initHeader();
  }
});
