/**
 * MD 一覧カードに先頭プレビューを挿入する（Contexts トップ・シリーズ一覧など）。
 * 各 .sub-card 内の a.btn-context-dl[href$=".md"] を検出して fetch する。
 */
(function () {
  var MAX_LINES = 26;
  var MAX_CHARS = 1600;

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

  function truncateMd(text) {
    var normalized = text.replace(/\r\n/g, "\n");
    var lines = normalized.split("\n");
    var byLines = lines.slice(0, MAX_LINES).join("\n");
    var out = byLines.length > MAX_CHARS ? normalized.slice(0, MAX_CHARS) : byLines;
    var truncated = lines.length > MAX_LINES || out.length < normalized.length;
    if (truncated) {
      out += "\n\n… （先頭のみ表示 · 全文は「全文を開く」またはダウンロード）";
    }
    return out;
  }

  function findMdCards(root) {
    return [].slice.call(root.querySelectorAll("article.sub-card")).filter(function (card) {
      return card.querySelector('a.btn-context-dl[href$=".md"]');
    });
  }

  function enhanceCard(card, mdUrl) {
    var actions = card.querySelector(".context-md-actions");
    if (!actions) return;

    var shell = document.createElement("div");
    shell.className = "context-md-preview-shell";
    shell.setAttribute("data-md-preview", "");

    var head = document.createElement("div");
    head.className = "context-md-preview-head";
    head.innerHTML =
      '<span class="context-md-preview-label">Markdown 先頭</span>' +
      '<span class="context-md-preview-filename"></span>';

    var pre = document.createElement("pre");
    pre.className = "context-md-preview-body";
    pre.setAttribute("tabindex", "0");
    pre.setAttribute("aria-label", "Markdown の先頭プレビュー");

    var fn = head.querySelector(".context-md-preview-filename");
    try {
      var u = new URL(mdUrl, window.location.href);
      fn.textContent = u.pathname.split("/").pop() || mdUrl;
    } catch (e) {
      fn.textContent = mdUrl;
    }

    shell.appendChild(head);
    shell.appendChild(pre);
    card.appendChild(shell);

    pre.textContent = "読み込み中…";

    var fetchUrl = fetchPathFor(mdUrl);
    fetch(fetchUrl, { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.text();
      })
      .then(function (text) {
        card.classList.add("sub-card--with-md-preview");
        pre.textContent = truncateMd(text);
      })
      .catch(function () {
        card.classList.add("sub-card--with-md-preview", "sub-card--preview-error");
        pre.textContent =
          "（プレビューを読み込めませんでした）\n\nfile:// で開いている場合はローカルサーバー（例: npx serve）を利用するか、ダウンロードで取得してください。";
      });
  }

  function run(root) {
    findMdCards(root || document).forEach(function (card) {
      var a = card.querySelector('a.btn-context-dl[href$=".md"]');
      if (!a || card.querySelector("[data-md-preview]")) return;
      enhanceCard(card, a.getAttribute("href"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      run(document);
    });
  } else {
    run(document);
  }
})();
