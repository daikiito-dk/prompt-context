/**
 * Tools page: app-like list + native <dialog> detail sheet
 */
(function () {
  var TOOLS = {
    cursor: {
      title: "Cursor",
      tag: "AI ネイティブ IDE",
      url: "https://cursor.com/",
      lines: [
        "リポジトリ全体を文脈にした編集やエージェント実行が可能な開発環境です。",
        "Rules や MCP などでチームやプロジェクト単位の振る舞いを揃えやすいです。",
      ],
    },
    windsurf: {
      title: "Windsurf",
      tag: "IDE · Cascade / Flow",
      url: "https://windsurf.com/",
      lines: [
        "広いコンテキストを前提に、対話と編集をつなげるフローが特徴の IDE です。",
        "ターミナル連携や複数ステップのタスクに向く使われ方があります。",
      ],
    },
    copilot: {
      title: "GitHub Copilot",
      tag: "IDE 拡張",
      url: "https://github.com/features/copilot",
      lines: [
        "Visual Studio Code や JetBrains など主要エディタに載せて使うコーディング支援です。",
        "GitHub を中心とした開発フローと組み合わせる例が多いです。チャット・エージェント機能は製品更新とともに拡張されています。",
      ],
    },
    claude: {
      title: "Claude（Anthropic）",
      tag: "モデル · アプリ · API",
      url: "https://www.anthropic.com/claude",
      lines: [
        "長い文脈や指示追従の用途でよく選ばれるモデルファミリです。",
        "Web アプリ・API・各種プロダクトのバックエンドとして利用されます。",
      ],
    },
    "claude-code": {
      title: "Claude Code",
      tag: "CLI",
      url: "https://github.com/anthropics/claude-code",
      lines: [
        "ターミナルからリポジトリ操作や複数ファイルにまたがる作業を進めるための CLI ツールです。",
        "ローカル環境のポリシーとあわせて利用可否を判断してください。",
      ],
    },
    openai: {
      title: "OpenAI",
      tag: "ChatGPT · API",
      url: "https://openai.com/",
      lines: [
        "対話型アプリ、API、デスクトップなど複数の接点から利用できるプラットフォームです。",
        "社内向け連携ではデータ送信範囲と保管条件を契約で確認することが重要です。",
      ],
    },
    gemini: {
      title: "Google Gemini",
      tag: "モデル · AI Studio",
      url: "https://deepmind.google/technologies/gemini/",
      lines: [
        "Google のマルチモーダル言語モデル群です。開発者向けには AI Studio やクラウド経由の API が用意されています。",
        "Android Studio など他プロダクトとの統合も進んでいます。",
      ],
    },
    vscode: {
      title: "Visual Studio Code",
      tag: "エディタ",
      url: "https://code.visualstudio.com/",
      lines: [
        "拡張機能エコシステムが大きく、AI 支援も拡張や公式統合で足していく構成が一般的です。",
        "多くの言語・フレームワークでデファクトに近いシェアを持ちます。",
      ],
    },
    jetbrains: {
      title: "JetBrains IDE",
      tag: "IntelliJ ほか",
      url: "https://www.jetbrains.com/",
      lines: [
        "IntelliJ IDEA、PyCharm、WebStorm など言語・用途別の IDE を提供しています。",
        "組み込み AI アシスタントやプラグインで補完・対話機能を足せます。",
      ],
    },
    supabase: {
      title: "Supabase",
      tag: "BaaS",
      url: "https://supabase.com/",
      lines: [
        "PostgreSQL を中心に、認証・ストレージ・Edge Functions などをまとめたバックエンド基盤です。",
        "プロトタイプから本番まで、フロントとセットで選ばれることがあります。",
      ],
    },
    devin: {
      title: "Devin",
      tag: "自律エージェント",
      url: "https://devin.ai/",
      lines: [
        "開発タスクをエージェントに任せる形のサービス例です。提供内容は更新が早いため公式情報を確認してください。",
        "試験導入では情報管理ポリシーと契約条項のレビューを推奨します。",
      ],
    },
  };

  var dialog = document.getElementById("tools-sheet");
  var titleEl = document.getElementById("tools-sheet-title");
  var tagEl = document.getElementById("tools-sheet-tag");
  var bodyEl = document.getElementById("tools-sheet-body");
  var linkEl = document.getElementById("tools-sheet-link");
  var closeBtn = document.getElementById("tools-sheet-close");
  if (!dialog || !titleEl || !bodyEl || !linkEl) return;

  function openTool(key) {
    var d = TOOLS[key];
    if (!d) return;
    titleEl.textContent = d.title;
    tagEl.textContent = d.tag || "";
    tagEl.style.display = d.tag ? "" : "none";
    bodyEl.textContent = "";
    d.lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      bodyEl.appendChild(p);
    });
    linkEl.href = d.url;
    linkEl.textContent = "公式サイトを開く";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  document.querySelectorAll(".tools-app-row[data-tool]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openTool(btn.getAttribute("data-tool"));
    });
  });

  closeBtn.addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    closeBtn.blur();
  });
})();
