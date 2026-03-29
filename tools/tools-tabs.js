/**
 * Tools page: purpose tabs (aria-compliant)
 */
(function () {
  var root = document.querySelector("[data-tools-tabs]");
  if (!root) return;

  var tabs = root.querySelectorAll(".tools-tabs__tab");
  var panels = root.querySelectorAll(".tools-tabs__panel");

  function activate(id) {
    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-tools-tab") === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (panel) {
      var match = panel.id === "panel-purpose-" + id;
      panel.classList.toggle("is-active", match);
      if (match) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab.getAttribute("data-tools-tab"));
    });
    tab.addEventListener("keydown", function (e) {
      var idx = Array.prototype.indexOf.call(tabs, tab);
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        activate(next.getAttribute("data-tools-tab"));
      }
    });
  });
})();
