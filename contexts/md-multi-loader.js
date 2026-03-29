/**
 * 1 ページ内の複数 MD を読み込む。各ブロックに data-md-block と data-md-path、子に pre.code-block を置く。
 */
(function () {
  function loadBlock(root) {
    var path = root.getAttribute("data-md-path");
    var pre = root.querySelector("pre.code-block");
    if (!path || !pre) return;

    fetch(path, { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.text();
      })
      .then(function (text) {
        pre.textContent = text;
      })
      .catch(function () {
        pre.textContent =
          "（読み込みに失敗しました）\n\nパス: " +
          path +
          "\n\n※ file:// で開いている場合はローカルサーバー（例: npx serve）で表示してください。";
      });
  }

  function run() {
    document.querySelectorAll("[data-md-block]").forEach(loadBlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
