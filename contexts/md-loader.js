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

  var path = document.body.getAttribute("data-md-path");
  var pre = document.getElementById("md-source");
  if (!path || !pre) return;

  var url = fetchPathFor(path);
  fetch(url, { credentials: "same-origin" })
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.text();
    })
    .then(function (text) {
      pre.textContent = text;
    })
    .catch(function () {
      pre.textContent =
        "（読み込みに失敗しました）\n\n指定: " +
        path +
        "\n取得 URL: " +
        url +
        "\n\n※ file:// で開いている場合はローカルサーバー（例: npx serve）で表示してください。";
    });
})();
