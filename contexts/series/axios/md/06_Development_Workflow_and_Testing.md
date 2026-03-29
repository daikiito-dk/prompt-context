---
title: 06_Development_Workflow_and_Testing (Final Chunk)
version: 1.x (Current Stable)
priority: MEDIUM
category: workflow-and-testing
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 06_Development_Workflow_and_Testing

## 1. 開発環境のセットアップ (Environment Setup)
AIがローカル環境やCI環境での挙動をシミュレートするための前提条件。

* **Dependency Management:** プロジェクトでは `npm` または `yarn` を使用し、Axiosのバージョンは常に `^1.x.x` を前提とする。
* **TypeScript Integration:** `@types/axios` は不要（Axios本体に型定義が含まれている）。AIは常に `import axios, { AxiosResponse, AxiosError } from 'axios';` の形式でインポートを行うこと。

## 2. デバッグ指針 (Debugging Strategy)
エラー発生時にAIが原因を特定するためのプロセス。

* **Logging Interceptors:** 開発環境（`process.env.NODE_ENV === 'development'`）では、リクエストのURL、メソッド、ヘッダー、およびレスポンス時間をコンソールに出力するインターセプターを有効化せよ。
* **Network Tab Analysis:** AIは「ブラウザのネットワークタブで確認できる情報（Raw Request/Response）」と、Axiosの `config` オブジェクトの差異を意識してトラブルシューティングを行うこと。

## 3. テストの設計規格 (Testing Standards)
Axiosを利用するロジックに対するユニットテストおよびモックの作法。

### 3.1. モックライブラリの選定
* **[axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter):** 最も推奨されるOSSツール。APIのレスポンスをシミュレートし、境界値テスト（404, 500エラー等）を容易にする。
* **msw (Mock Service Worker):** ネットワークレベルでインターセプトを行うモダンなアプローチ。

### 3.2. テストケースの必須項目
AIがテストコードを生成する際、以下のケースを必ず含めること。
1. **Success Path:** 正しいデータが返り、型定義通りに処理されること。
2. **Network Error:** タイムアウトやDNS解決失敗時に `AxiosError` が正しく捕捉されること。
3. **API Error (4xx/5xx):** サーバーからのエラーメッセージがユーザーインターフェースに伝播すること。
4. **Cancellation:** `AbortController` による中断が、意図しない副作用（メモリリーク等）を起こさないこと。

## 4. CI/CD 統合 (CI/CD Integration)
* **Automated Testing:** プルリクエスト（PR）作成時に、すべてのAPIラッパーに対するユニットテストを実行する。
* **Bundle Size Monitoring:** `axios` は軽量だが、インターセプターやヘルパーが肥大化していないか定期的にチェックする。

---
## 5. AIへの最終コマンド (Final Execution Instructions)
1. **リファクタリングの提案:** 既存のコードが `axios.defaults` に依存している場合、`axios.create()` を用いたカプセル化へのリファクタリングを最優先で提案せよ。
2. **テストファースト:** 新機能の実装を求められた際、まずその機能に対する「テストコードの構成案」を提示してから実装に移れ。
3. **ドキュメントの同期:** コード変更に伴い、`04_API_Standards_and_Models.md` に記載されたインターフェースに変更が必要な場合は即座に指摘せよ。
