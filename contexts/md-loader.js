(function () {
  var path = document.body.getAttribute("data-md-path");
  var pre = document.getElementById("md-source");
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
})();
