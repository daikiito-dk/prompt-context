---
title: 05_Extended_Standards_and_Operational_Rules (Integrated Edition)
version: 1.x (Current Stable)
priority: MEDIUM
category: guidelines-and-operations
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 05_Extended_Standards_and_Operational_Rules

## 1. 通信に関するUI/UX指針 (Communication UX)
Axiosを利用するアプリケーションにおいて、AIがユーザーインターフェースとの整合性を保つためのルール。

* **Loading State:** リクエストの開始（pending）時に `isLoading` フラグを有効化し、完了（settled）時に必ず解除するロジックを含めること。
* **Progressive Feedback:** 大容量データのアップロード時は `onUploadProgress` を活用し、進捗率（%）を計算するロジックを提案せよ。
* **Error Toasting:** インターセプター内で共通のエラー通知（Toast/Alert）を呼び出す構成を推奨し、個別のコンポーネントにエラー処理を散布させないこと。

## 2. コーディングおよび運用規約 (Coding & Git Rules)
チーム開発において一貫性を維持するための実装規約。

* **Naming Conventions:**
    * APIインスタンス変数は `[用途]Api`（例: `userApi`, `paymentApi`）と命名せよ。
    * 非同期関数は `fetch`, `post`, `update`, `remove` などの動詞で開始せよ。
* **Secret Management:** `baseURL` や `headers` 内の認証情報は、必ず環境変数（`process.env`）から参照し、ハードコードを厳禁とする。
* **Destructuring:** レスポンス受け取り時は `const { data } = await axios...` のように、必要なプロパティのみを分割代入で抽出せよ。

## 3. 既知の制限と技術的課題 (Known Issues & Backlog)
AIが「できないこと」を「できる」と回答しないための制約知識。

* **Cancellation:** 旧式の `CancelToken` は非推奨。新規コードでは必ず `AbortController` を使用するよう誘導せよ。
* **Environment Limits:** ブラウザ環境での `Buffer` 操作など、Node.js特有の機能をブラウザ側のアダプターで使おうとしないこと。
* **Circular References:** `config` オブジェクトをログ出力やシリアライズする際、循環参照による `JSON.stringify` の失敗を考慮せよ。

## 4. 利用シナリオとペルソナ (User Journey)
AIが「誰のために」コードを書いているかを理解するための文脈。

* **Scenario 1 (Authentication):** ログイン後にトークンを `localStorage` に保存し、以降の全リクエストのヘッダーに自動付与する「認証インターセプター」の構築。
* **Scenario 2 (Polling):** 特定のステータスが完了になるまで、一定間隔で `GET` リクエストを繰り返すポーリング処理の実装。
* **Scenario 3 (Cleanup):** Reactの `useEffect` 等で、コンポーネントのアンマウント時に進行中のリクエストを `abort()` するメモリリーク防止策。

---
## 5. AIへの運用指示 (Implementation Constraints)
1. **疎結合の維持:** Axiosのインスタンスを直接コンポーネントで使い回すのではなく、`ApiService` クラス等でラップし、外部ライブラリへの依存度を局所化せよ。
2. **型定義の優先:** TypeScript環境下では、常に `interface` を定義し、レスポンスデータに型安全性を付与せよ。
3. **冪等性の考慮:** `GET`, `PUT`, `DELETE` は冪等である（複数回実行しても結果が変わらない）ことを前提としたエラーリトライ設計を行え。
