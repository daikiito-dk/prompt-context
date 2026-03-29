---
title: Domain Dictionary - Axios Terminology
version: 1.x (Current Stable)
priority: CRITICAL
category: dictionary
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 03_Domain_Dictionary: Axios Specific Terminology

## 1. コア・エンティティ (Core Entities)
AIがクラス名や型定義を扱う際に、混同を避けるべき基本用語。

| 用語 | 定義 | AIへの指示 |
| :--- | :--- | :--- |
| **Instance** | `axios.create()` によって生成されたオブジェクト。 | 常に特定の設定（baseURL等）を持つ独立した実体として扱うこと。 |
| **Config** | リクエストの挙動を制御する設定オブジェクト（Options）。 | `AxiosRequestConfig` 型として厳密に扱い、未知のプロパティを混ぜないこと。 |
| **Adapter** | 実行環境（ブラウザ/Node）に応じた通信の実装をカプセル化したもの。 | 「通信の具現化層」として定義し、ビジネスロジックを混ぜないこと。 |
| **Interceptor** | リクエスト/レスポンスのパイプラインに挿入される中間処理。 | 複数登録可能（Chain）であることを前提とした設計を行うこと。 |

## 2. 通信プロセス用語 (Communication Process)
リクエストのライフサイクルに関連する専門用語。

* **Dispatch (ディスパッチ):** * 定義: インターセプターを通過した後、実際にアダプターを呼び出して通信を開始する行為。
    * 文脈: `dispatchRequest` は内部関数であり、ユーザーが直接呼ぶものではない。
* **Settlement (セトルメント):**
    * 定義: Promiseが `fulfilled`（成功）または `rejected`（失敗）の状態に確定すること。
    * 文脈: Axiosではステータスコード 2xx なら `resolve`、それ以外なら `reject` するのがデフォルト。
* **Transformation (トランスフォーメーション):**
    * 定義: 送信前のデータ（Object → JSON）や受信後のデータ（JSON → Object）の加工。
    * 文脈: `transformRequest` / `transformResponse` プロパティを指す。

## 3. エラー・例外処理 (Error & Exception)
エラーハンドリングに関連する固有名詞。

* **AxiosError:**
    * 定義: 標準の `Error` オブジェクトを拡張し、`config`, `request`, `response` プロパティを付加した専用クラス。
* **CancelToken / AbortSignal:**
    * 定義: 実行中のリクエストを途中で破棄するための識別子。
    * 文脈: 旧式は `CancelToken`、現在は標準の `AbortSignal` を推奨。
* **Validation Strategy:**
    * 定義: どのHTTPステータスコードを「エラー」とみなすかの判定ロジック。
    * 文脈: `validateStatus` プロパティで定義される。

## 4. コンテキスト共有のためのエイリアス (Contextual Aliases)
AIが自然言語で指示を受けた際に、以下の単語をAxiosの特定の機能と紐付けること。

* **"Middlewares"** → `Interceptors` と解釈せよ。
* **"Base URL"** → `config.baseURL` と解釈せよ。
* **"Payload"** → `config.data` と解釈せよ。
* **"Request Header"** → `config.headers` と解釈せよ。

## 5. 技術スタック・依存関係の呼称
* **XHR:** `XMLHttpRequest`（ブラウザ環境の通信エンジン）。
* **http/https modules:** Node.js標準の通信エンジン。
* **Promise:** Axiosの非同期処理の基盤となるES6標準。

---
## 6. AIへの運用指示
1. **命名規則:** 内部ロジックを生成する際は、上記用語（`Adapter`, `Interceptor`, `Config`）を優先的に変数名・クラス名に使用すること。
2. **意味の固定:** ユーザーが「アダプターを作って」と言った場合、それは「通信エンジンを自作する」ことを意味し、「ラッパー関数を作る」ことではないと理解せよ。
