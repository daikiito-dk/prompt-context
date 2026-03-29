(function () {
  var catalogEl = document.getElementById("prompt-catalog");
  var searchInput = document.getElementById("asset-search");
  var statsEl = document.getElementById("prompts-stats");
  if (!catalogEl || !searchInput) return;

  var rawData = null;
  var scoresMap = {};
  var copyBodies = Object.create(null);

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

  function syncHintVisibility() {
    var hintEl = document.getElementById("prompt-score-api-hint");
    if (hintEl) hintEl.hidden = Boolean(apiBase());
  }

  function applyScoresToBadges(root) {
    var base = apiBase();
    root.querySelectorAll(".copy-score-global").forEach(function (el) {
      var id = el.getAttribute("data-prompt-id");
      if (!base) {
        setScoreState(el, "—", { offline: true });
        return;
      }
      if (id != null && scoresMap[id] !== undefined) {
        setScoreState(el, scoresMap[id]);
      }
    });
  }

  function loadScoresFromApi() {
    var base = apiBase();
    if (!base) {
      catalogEl.querySelectorAll(".copy-score-global").forEach(function (el) {
        setScoreState(el, "—", { offline: true });
      });
      return;
    }
    fetchScores(base)
      .then(function (data) {
        var scores = (data && data.scores) || {};
        scoresMap = scores;
        applyScoresToBadges(catalogEl);
      })
      .catch(function () {
        catalogEl.querySelectorAll(".copy-score-global").forEach(function (el) {
          setScoreState(el, "—", { offline: true });
        });
      });
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function promptMatches(prompt, q) {
    if (!q) return true;
    var hay = normalize([prompt.title, prompt.description, prompt.body].join(" "));
    return hay.indexOf(q) !== -1;
  }

  function categoryMetaMatches(category, q) {
    if (!q) return false;
    var hay = normalize([category.title, category.hint].join(" "));
    return hay.indexOf(q) !== -1;
  }

  function visiblePromptsForCategory(category, q) {
    if (!q) return category.prompts.slice();
    if (categoryMetaMatches(category, q)) return category.prompts.slice();
    return category.prompts.filter(function (p) {
      return promptMatches(p, q);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightInlines(s) {
    s = s.replace(/\*\*([^*]+)\*\*/g, function (_, inner) {
      return (
        '<span class="ph-em">' +
        '<span class="ph-em-mark">**</span>' +
        inner +
        '<span class="ph-em-mark">**</span>' +
        "</span>"
      );
    });
    s = s.replace(/【([^】]*)】/g, '<span class="ph-jp">【$1】</span>');
    s = s.replace(/\[([^\]]+)\]/g, '<span class="ph-slot">[$1]</span>');
    return s;
  }

  function highlightLine(line) {
    var t = String(line);
    if (/^<{3}/.test(t) || /^CONTEXT_END>>>/.test(t)) {
      return '<span class="ph-fence">' + escapeHtml(t) + "</span>";
    }
    if (/^-{3,}\s*$/.test(t)) {
      return '<span class="ph-rule">' + escapeHtml(t) + "</span>";
    }
    var m;
    if ((m = t.match(/^(#{1,6})(\s*)(.*)$/))) {
      return (
        '<span class="ph-hash">' +
        escapeHtml(m[1] + m[2]) +
        "</span>" +
        highlightInlines(escapeHtml(m[3]))
      );
    }
    if ((m = t.match(/^(\d+\.\s)(.*)$/))) {
      return (
        '<span class="ph-ol">' + escapeHtml(m[1]) + "</span>" + highlightInlines(escapeHtml(m[2]))
      );
    }
    if ((m = t.match(/^(-\s)(.*)$/))) {
      return (
        '<span class="ph-ul">' + escapeHtml(m[1]) + "</span>" + highlightInlines(escapeHtml(m[2]))
      );
    }
    return highlightInlines(escapeHtml(t));
  }

  function highlightPromptBodyHtml(text) {
    var lines = (text || "").split(/\n/);
    return lines.map(highlightLine).join("<br>");
  }

  function attachCopyHandlers(root) {
    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".copy-btn");
      if (!btn || !root.contains(btn)) return;
      var id = btn.getAttribute("data-copy-target");
      var el = id ? document.getElementById(id) : null;
      if (!el) return;
      var raw =
        id && Object.prototype.hasOwnProperty.call(copyBodies, id) ? copyBodies[id] : el.textContent || "";
      navigator.clipboard.writeText(raw).then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copy-btn--success");
        window.setTimeout(function () {
          btn.textContent = prev;
          btn.classList.remove("copy-btn--success");
        }, 2000);

        var base = apiBase();
        if (!base || !id) return;
        postIncrement(base, id)
          .then(function (json) {
            if (!json || json.id !== id) return;
            scoresMap[id] = json.count;
            var badge = catalogEl.querySelector('.copy-score-global[data-prompt-id="' + id + '"]');
            if (badge) setScoreState(badge, json.count);
          })
          .catch(function () {});
      });
    });
  }

  function render() {
    var q = normalize(searchInput.value);
    catalogEl.textContent = "";
    copyBodies = Object.create(null);

    if (!rawData || !rawData.categories || !rawData.categories.length) {
      if (statsEl) {
        statsEl.hidden = true;
        statsEl.textContent = "";
      }
      var err = document.createElement("p");
      err.className = "prompt-catalog-message prompt-catalog-message--error";
      err.textContent = "データを読み込めませんでした。";
      catalogEl.appendChild(err);
      return;
    }

    var anyShown = false;
    var shownCategories = 0;
    var shownPrompts = 0;
    var base = apiBase();

    rawData.categories.forEach(function (category) {
      var prompts = visiblePromptsForCategory(category, q);
      if (!prompts.length) return;
      anyShown = true;
      shownCategories += 1;
      shownPrompts += prompts.length;

      var details = document.createElement("details");
      details.className = "prompt-category";
      details.open = Boolean(q);

      var summary = document.createElement("summary");
      summary.className = "prompt-category-summary";

      var summaryText = document.createElement("div");
      summaryText.className = "prompt-category-summary-text";

      var titleSpan = document.createElement("span");
      titleSpan.className = "prompt-category-title";
      titleSpan.textContent = category.title;

      var hintSpan = document.createElement("span");
      hintSpan.className = "prompt-category-hint";
      hintSpan.textContent = category.hint || "";

      summaryText.appendChild(titleSpan);
      summaryText.appendChild(hintSpan);

      var countBadge = document.createElement("span");
      countBadge.className = "prompt-category-count";
      countBadge.setAttribute("aria-label", "このカテゴリーのプロンプト数");
      countBadge.textContent = String(prompts.length);

      summary.appendChild(summaryText);
      summary.appendChild(countBadge);

      var body = document.createElement("div");
      body.className = "prompt-category-body";

      prompts.forEach(function (p) {
        var section = document.createElement("section");
        section.className = "prompt-item";

        var header = document.createElement("div");
        header.className = "prompt-header";

        var main = document.createElement("div");
        main.className = "prompt-header-main";

        var h3 = document.createElement("h3");
        h3.className = "prompt-title";
        h3.textContent = p.title;

        var desc = document.createElement("p");
        desc.className = "prompt-desc";
        desc.textContent = p.description || "";

        main.appendChild(h3);
        main.appendChild(desc);

        var actions = document.createElement("div");
        actions.className = "prompt-header-actions";

        var copyRow = document.createElement("div");
        copyRow.className = "prompt-copy-row";

        var scoreSpan = document.createElement("span");
        scoreSpan.className = "copy-score-global copy-score-global--loading";
        scoreSpan.setAttribute("data-prompt-id", p.id);
        scoreSpan.setAttribute("aria-label", "みんなのコピー回数（サーバー集計）");
        scoreSpan.textContent = "—";
        if (!base) setScoreState(scoreSpan, "—", { offline: true });

        var copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "copy-btn";
        copyBtn.setAttribute("data-copy-target", p.id);
        copyBtn.textContent = "Copy";

        copyRow.appendChild(scoreSpan);
        copyRow.appendChild(copyBtn);
        actions.appendChild(copyRow);

        header.appendChild(main);
        header.appendChild(actions);

        var pre = document.createElement("pre");
        pre.id = p.id;
        pre.className = "code-block code-block--asset code-block--syntax";
        var bodyText = p.body || "";
        copyBodies[p.id] = bodyText;
        pre.innerHTML = highlightPromptBodyHtml(bodyText);

        section.appendChild(header);
        section.appendChild(pre);
        body.appendChild(section);
      });

      details.appendChild(summary);
      details.appendChild(body);
      catalogEl.appendChild(details);
    });

    if (statsEl) {
      if (anyShown) {
        statsEl.hidden = false;
        statsEl.textContent = q.length
          ? "検索結果: " + shownPrompts + " 件 · " + shownCategories + " カテゴリー"
          : "全 " + shownPrompts + " プロンプト · " + shownCategories + " カテゴリー";
      } else {
        statsEl.hidden = true;
        statsEl.textContent = "";
      }
    }

    if (!anyShown) {
      var empty = document.createElement("p");
      empty.className = "prompt-catalog-message";
      empty.textContent =
        q.length > 0
          ? "検索に一致するプロンプトがありません。別のキーワードを試してください。"
          : "表示できるプロンプトがありません。";
      catalogEl.appendChild(empty);
    }

    applyScoresToBadges(catalogEl);
  }

  var debounceTimer;
  function onSearchInput() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(render, 120);
  }

  syncHintVisibility();
  searchInput.addEventListener("input", onSearchInput);
  attachCopyHandlers(catalogEl);

  catalogEl.innerHTML =
    '<p class="prompt-catalog-message" id="prompt-catalog-loading">読み込み中…</p>';

  fetch("prompts-data.json", { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(function (json) {
      rawData = json;
      var loading = document.getElementById("prompt-catalog-loading");
      if (loading) loading.remove();
      render();
      loadScoresFromApi();
    })
    .catch(function () {
      catalogEl.innerHTML = "";
      var err = document.createElement("p");
      err.className = "prompt-catalog-message prompt-catalog-message--error";
      err.textContent =
        "prompts-data.json の読み込みに失敗しました。ネットワークまたはファイル配置を確認してください。";
      catalogEl.appendChild(err);
    });
})();
