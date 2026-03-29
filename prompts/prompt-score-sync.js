(function () {
  function apiBase() {
    var b = document.body && document.body.getAttribute("data-prompt-score-api");
    return (b && String(b).trim()) || "";
  }

  function trimBase(base) {
    return String(base).replace(/\/+$/, "");
  }

  function setScoreState(el, value, opts) {
    el.classList.remove("copy-score-global--loading", "copy-score-global--offline");
    if (opts && opts.offline) {
      el.classList.add("copy-score-global--offline");
      el.textContent = "—";
      return;
    }
    el.textContent = String(value);
  }

  function fetchScores(base) {
    var url = trimBase(base) + "/api/scores";
    return fetch(url, { credentials: "omit" }).then(function (res) {
      if (!res.ok) throw new Error("scores");
      return res.json();
    });
  }

  function postIncrement(base, id) {
    var url = trimBase(base) + "/api/increment";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
      credentials: "omit",
    }).then(function (res) {
      if (!res.ok) throw new Error("increment");
      return res.json();
    });
  }

  var base = apiBase();
  var hintEl = document.getElementById("prompt-score-api-hint");

  document.querySelectorAll(".copy-score-global").forEach(function (el) {
    if (!base) {
      setScoreState(el, "—", { offline: true });
    }
  });

  if (hintEl) {
    hintEl.hidden = Boolean(base);
  }

  if (base) {
    fetchScores(base)
      .then(function (data) {
        var scores = (data && data.scores) || {};
        document.querySelectorAll(".copy-score-global").forEach(function (el) {
          var id = el.getAttribute("data-prompt-id");
          var raw = id ? scores[id] : 0;
          var n = raw != null ? parseInt(String(raw), 10) : 0;
          if (isNaN(n) || n < 0) n = 0;
          setScoreState(el, n);
        });
      })
      .catch(function () {
        document.querySelectorAll(".copy-score-global").forEach(function (el) {
          setScoreState(el, "—", { offline: true });
        });
      });
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-copy-target");
      var el = id ? document.getElementById(id) : null;
      if (!el) return;
      navigator.clipboard.writeText(el.innerText).then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied!";
        window.setTimeout(function () {
          btn.textContent = prev;
        }, 2000);

        var b = apiBase();
        if (!b) return;
        postIncrement(b, id)
          .then(function (json) {
            if (!json || json.id !== id) return;
            var badge = document.querySelector('.copy-score-global[data-prompt-id="' + id + '"]');
            if (badge) setScoreState(badge, json.count);
          })
          .catch(function () {});
      });
    });
  });
})();
