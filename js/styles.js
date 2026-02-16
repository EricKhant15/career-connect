(function () {
  const css = [
    "css/base.css",
    "css/layout.css",
    "css/components.css",
    "css/forms.css",
    "css/recommended.css",
  ];

  css.forEach(loadCss);

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Only load landing.css on index.html
  if (page === "index.html" || page === "") {
    loadCss("css/landing.css");
  }

  function loadCss(href) {
    if ([...document.querySelectorAll("link[rel='stylesheet']")].some(l => l.getAttribute("href") === href)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
})();
