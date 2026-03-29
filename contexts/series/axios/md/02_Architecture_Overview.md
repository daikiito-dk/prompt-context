---
title: Architecture Overview - Axios Internal Flow
version: 1.x (Current Stable)
priority: HIGH
category: technical-architecture
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 02_Architecture_Overview: Axios Internal Mechanics

## 1. アーキテクチャの全体像 (System Landscape)
Axiosの設計は、**「リクエストの構築 → 変換 → 送出 → 応答の変換」**という一連のパイプライン処理である。
最大の特徴は、ユーザーが触れる `axios.get()` などのインターフェースの下に、実行環境（Browser/Node.js）を抽象化する「Adapterレイヤー」が存在することである。

## 2. リクエスト・ライフサイクル (The Request Lifecycle)
一つのHTTPリクエストが完了するまでの論理的なステップは以下の通り。

1.  **Entry Point:** `axios(config)` または `axios.get(url, config)` の呼び出し。
2.  **Request Interceptors:** `dispatchRequest` が呼ばれる前に、登録されたリクエストインターセプターを**登録の逆順**で実行する。
3.  **Data Transformation (Request):** `transformRequest` 関数群により、JavaScriptオブジェクトをJSON文字列等にシリアライズする。
4.  **Dispatch Request:** 実際の通信処理へ移行。
5.  **Adapter Selection:** * ブラウザ環境なら `XMLHttpRequest` アダプターを選択。
    * Node.js環境なら `http` / `https` モジュールアダプターを選択。
6.  **Data Transformation (Response):** サーバーからの生データを `transformResponse` 関数群でパース（JSON.parse等）。
7.  **Response Interceptors:** `then/catch` に渡る前に、レスポンスインターセプターを**登録順**で実行する。
8.  **Settlement:** Promiseが `resolve` または `reject` される。

## 3. 主要コンポーネントの役割 (Core Components)

### 3.1. Axios Class (`lib/core/Axios.js`)
* すべてのリクエストメソッド（get, post等）を保持するコアクラス。
* `interceptors` 管理オブジェクトをメンバとして持ち、リクエストの「鎖（Chain）」を構築する司令塔。

### 3.2. Interceptor Manager (`lib/core/InterceptorManager.js`)
* インターセプターの登録（use）と削除（eject）を管理する。
* スタック形式で保存し、実行時に実行キューへ流し込む。

### 3.3. Dispatch Request (`lib/core/dispatchRequest.js`)
* インターセプターとアダプターの中間に位置するブリッジ。
* リクエストデータの最終的な加工と、アダプターからのレスポンスの正規化を担当する。

### 3.4. Adapters (`lib/adapters/`)
* **xhr.js:** ブラウザ用。標準のXHR APIを使用し、進捗（onDownloadProgress）なども制御。
* **http.js:** Node.js用。ストリーム処理やプロキシ設定などをサポート。
* **Custom Adapter:** ユーザーがテスト用（Mock）や独自のプロトコル用にアダプターを差し替えることが可能。

## 4. データの流れと変換 (Data Flow & Transformation)
Axiosは、`config.transformRequest` と `config.transformResponse` という配列形式の変換パイプラインを持つ。

* **デフォルトの動作:** * 送信時は `Content-Type` を見て自動的に文字列化。
    * 受信時は `application/json` であれば自動的にオブジェクト化。
* **拡張性:** ユーザーはこれに独自の関数を追加することで、暗号化/復号化や特定のデータ形式（Protocol Buffers等）への変換を差し込める。

## 5. エラーハンドリングの構造 (Error Handling)
エラーは単なる文字列ではなく、`AxiosError` オブジェクトとしてカプセル化される。

* **code:** `ERR_NETWORK`, `ECONNABORTED` 等の定数。
* **config:** 失敗したリクエストの設定。
* **request/response:** 失敗時の生データ。
* **isAxiosError:** Axios特有のエラーであるかを判定するフラグ。

## 6. ディレクトリ構造の意図 (Source Map)
AIがソースコードを参照する際のガイドライン。

* `/lib/core/`: 基本ロジック（Axiosの心臓部）。
* `/lib/adapters/`: 環境ごとの通信実装（最も低レイヤー）。
* `/lib/helpers/`: URLの構築、クッキー管理、ヘッダーの正規化などの汎用ユーティリティ。
* `/lib/cancel/`: キャンセル（Abort）ロジックの実装。

---
## 7. AIへのコンテキスト指示
コードのデバッグや機能追加を依頼された際、AIは「どのレイヤー（インターセプターなのか、アダプターなのか、それともヘルパーなのか）」に手を加えるべきかを、この構造図に基づいて判断すること。
