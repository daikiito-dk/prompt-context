(function () {
  document.body.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".copy-btn[data-copy-target]");
    if (!btn) return;
    var id = btn.getAttribute("data-copy-target");
    var pre = id ? document.getElementById(id) : null;
    if (!pre) return;
    var text = pre.textContent || "";
    navigator.clipboard.writeText(text).then(function () {
      var prev = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copy-btn--success");
      window.setTimeout(function () {
        btn.textContent = prev;
        btn.classList.remove("copy-btn--success");
      }, 2000);
    });
  });
})();
