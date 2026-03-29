---
title: Architecture Overview - Axios
version: 1.x
priority: HIGH
category: architecture
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 02_Architecture_Overview: Axios

## 1. システム境界（なにを含み、なにを含まないか）

Axios は **HTTP クライアントライブラリ**である。DNS・TCP・TLS そのものは OS / ランタイムに委譲し、**リクエストの組み立て・送信・レスポンスの解釈・設定の合成**を担当する。

- **含む:** 設定（config）のマージ、インターセプター、`transformRequest` / `transformResponse`、環境別 Adapter、エラー型の正規化、Promise ベースの API。
- **含まない:** ルーティング、認証 IdP、REST のリソース設計そのもの、GraphQL クライアントとしての完全な役割（HTTP の上に乗るだけ）。

## 2. 実行時構成（文字によるブロック図）

```
[ユーザーコード]
    │
    ▼
axios(config) ──▶ dispatchRequest ──▶ Adapter ──▶ [XHR | Node http/https | fetch* ]
    │                    │                │
    │                    └─ Interceptors (req chain → adapter → res chain)
    │
    └─ axios.create() により独立した defaults / interceptors を保持
```

*一部環境・ビルドでは fetch 系の選択肢やカスタム Adapter があり得る。公式実装の中心は **ブラウザ = XHR / Node = http(s)**。

## 3. 主要モジュール（典型的な責務）

| 領域 | おもな役割 | 参照イメージ（リポジトリ内） |
|------|------------|-------------------------------|
| **core / Axios.js** | インスタンス生成、`request` のエントリ、デフォルトの合成 | ライブラリの心臓 |
| **defaults** | グローバル既定値（headers, transform, adapter, timeout 等） | |
| **adapters** | 環境ごとの「実送信」実装 | `xhr`, `http` |
| **core/dispatchRequest** | インターセプター適用後に Adapter を呼ぶ | |
| **interceptors** | 双方向チェーン | Fulfill / Reject で連鎖 |
| **cancel** | `AbortController` / signal 連携 | |
| **helpers** | URL 結合、validator、環境検出など | |

※ ディレクトリ名はバージョンで多少変わり得る。**「Adapter で環境差を吸収する」**という軸は不変とみなす。

## 4. 技術スタック（典型）

| レイヤー | 技術 |
|----------|------|
| 言語 | JavaScript（配布はビルド済み CommonJS / ESM / UMD 等） |
| ブラウザ送信 | `XMLHttpRequest` ベース |
| Node 送信 | `http` / `https` |
| 非同期 | Promise（`async/await` と相性よし） |
| テスト | Mocha 等（リポジトリの CI に準拠） |
| 品質 | ESLint / 型（TypeScript 型定義は別パッケージや同梱の扱いに注意） |

## 5. 設定のマージ順（概念）

defaults（グローバル） < インスタンス既定 < **リクエスト単位の config**。  
AI は「どの階層で `headers` や `baseURL` を足したか」を説明できるようにする。

## 6. ビルド成果物と利用形態

- **npm パッケージ**としてアプリから import / require。
- **CDN / bundle** によるブラウザ直読み込みのパターンも残存（利用は減トレンド）。

## 7. 拡張ポイント

- **カスタム Adapter**（テスト用モック、外部クライアントへの橋渡し）
- **インターセプター**（認証、ロギング、リトライポリシー）
- **transformRequest / transformResponse**（正規化・暗号化のフック）

---

*この文書は https://github.com/axios/axios の公開構造に基づく概観であり、細部はタグ・ブランチで追うこと。*
