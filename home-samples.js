(function () {
  function fetchPathFor(rel) {
    if (!rel) return rel;
    if (rel.charAt(0) === "/") return rel;
    var p = window.location.pathname.replace(/\/+$/, "");
    if (!p) p = "/";
    var dir;
    if (/\.html$/i.test(p)) {
      dir = p.replace(/\/[^/]+$/, "");
    } else {
      var i = p.lastIndexOf("/");
      dir = i > 0 ? p.slice(0, i) : "";
    }
    return dir + "/" + rel.replace(/^\//, "");
  }

  var SOURCES = {
    prompt: "prompts/sample.md",
    context: "contexts/md/01_Product_Core_Concept.md",
  };
  var MAX_CHARS = 1200;

  function truncate(text, max) {
    if (!text) return "";
    var s = String(text).replace(/\r\n/g, "\n").trim();
    if (s.length <= max) return s;
    return s.slice(0, max).trim() + "\n\n…";
  }

  function done(root, pre, err) {
    if (!pre || !root) return;
    root.setAttribute("aria-busy", "false");
    if (err) {
      pre.textContent = "（サンプルを読み込めませんでした。ローカルでは `npx serve` などで開いてください。）";
      return;
    }
  }

  function load(url, root, pre) {
    if (!root || !pre) return;
    root.setAttribute("aria-busy", "true");
    pre.textContent = "読み込み中…";
    var fetchUrl = fetchPathFor(url);
    fetch(fetchUrl, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then(function (text) {
        pre.textContent = truncate(text, MAX_CHARS);
        done(root, pre, false);
      })
      .catch(function () {
        done(root, pre, true);
      });
  }

  var promptRoot = document.querySelector('[data-home-sample="prompt"]');
  if (promptRoot) {
    load(SOURCES.prompt, promptRoot, promptRoot.querySelector(".home-sample-pre"));
  }

  var contextRoot = document.querySelector('[data-home-sample="context"]');
  if (contextRoot) {
    load(SOURCES.context, contextRoot, contextRoot.querySelector(".home-sample-pre"));
  }
})();
