(function () {
  var catalogEl = document.getElementById("prompt-catalog");
  var searchInput = document.getElementById("asset-search");
  var statsEl = document.getElementById("prompts-stats");
  if (!catalogEl || !searchInput) return;

  var rawData = null;

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function promptMatches(prompt, q) {
    if (!q) return true;
    var hay = normalize(
      [prompt.title, prompt.description, prompt.body, (prompt.models || []).join(" ")].join(" ")
    );
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

  function attachCopyHandlers(root) {
    root.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".copy-btn");
      if (!btn || !root.contains(btn)) return;
      var id = btn.getAttribute("data-copy-target");
      var el = id ? document.getElementById(id) : null;
      if (!el) return;
      navigator.clipboard.writeText(el.textContent || "").then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copy-btn--success");
        window.setTimeout(function () {
          btn.textContent = prev;
          btn.classList.remove("copy-btn--success");
        }, 2000);
      });
    });
  }

  function render() {
    var q = normalize(searchInput.value);
    catalogEl.textContent = "";

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
    rawData.categories.forEach(function (category) {
      var prompts = visiblePromptsForCategory(category, q);
      if (!prompts.length) return;
      anyShown = true;
      shownCategories += 1;
      shownPrompts += prompts.length;

      var details = document.createElement("details");
      details.className = "prompt-category";
      details.open = q ? true : Boolean(category.open);

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

        var tags = document.createElement("div");
        tags.className = "model-tags";
        tags.setAttribute("aria-label", "Recommended models");

        (p.models || []).forEach(function (m) {
          var span = document.createElement("span");
          span.className = "model-tag";
          span.textContent = m;
          tags.appendChild(span);
        });

        main.appendChild(h3);
        main.appendChild(desc);
        main.appendChild(tags);

        var actions = document.createElement("div");
        actions.className = "prompt-header-actions";
        var copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "copy-btn";
        copyBtn.setAttribute("data-copy-target", p.id);
        copyBtn.textContent = "Copy";
        actions.appendChild(copyBtn);

        header.appendChild(main);
        header.appendChild(actions);

        var pre = document.createElement("pre");
        pre.id = p.id;
        pre.className = "code-block code-block--asset";
        pre.textContent = p.body || "";

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
  }

  var debounceTimer;
  function onSearchInput() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(render, 120);
  }

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
