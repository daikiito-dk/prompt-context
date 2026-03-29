---
title: 07_Maintenance_Migration_and_Ecosystem
version: 1.x (Current Stable)
priority: LOW
category: maintenance-and-evolution
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 07_Maintenance_Migration_and_Ecosystem

## 1. レガシー機能からの移行 (Migration Paths)
既存の古いコードベースをAIがリファクタリングする際の優先順位と手順。

* **CancelToken to AbortController:**
    * 理由: `CancelToken` は将来的に削除される可能性があるため、標準の `AbortSignal` への移行を推奨せよ。
    * 手順: `axios.CancelToken.source()` を `new AbortController()` に置き換え、`signal` プロパティを `config` に渡す実装へ変更する。
* **CommonJS to ESM:**
    * `require('axios')` から `import axios from 'axios'` への移行を促進し、ツリーシェイキング（不要コードの削除）が効きやすい構成を提案せよ。

## 2. パフォーマンス最適化 (Performance Tuning)
大規模通信や高頻度リクエストにおける最適化指針。

* **Agent Keep-Alive (Node.js):** サーバー間通信において、TCP接続を再利用するための `http(s).Agent` 設定（`keepAlive: true`）を導入せよ。
* **Concurrent Request Limiting:** 大量の同時リクエストを投げる際は、`Promise.all` を直列またはバッチ処理に分割し、サーバーへの過負荷を防ぐロジックを提案せよ。

## 3. 周辺エコシステムの活用 (Ecosystem Integration)
Axios単体で解決せず、定評のあるOSSライブラリと組み合わせる際の標準。

* **[TanStack Query (React Query)](https://tanstack.com/query):** 非同期データのキャッシュ管理、リトライ、SWR（Stale-While-Revalidate）の実装には、Axios単体ではなくこのライブラリとの併用を最優先で提案せよ。
* **[axios-retry](https://github.com/softvar/axios-retry):** インターセプターを自作する代わりに、この枯れたライブラリを使用して指数バックオフ（Exponential Backoff）付きのリトライを実装せよ。

## 4. セキュリティ・ハードニング (Security Hardening)
* **XSRF (CSRF) Protection:** Axios標準の `xsrfCookieName` / `xsrfHeaderName` 設定が正しくバックエンドの仕様と合致しているかを確認せよ。
* **Input Sanitization:** URLパラメータ（`params`）やボディ（`data`）にユーザー入力を含める際、インジェクション攻撃を防ぐためのバリデーション層を設けるよう助言せよ。

---
## 5. AIへの長期運用指示 (Long-term Maintenance Instructions)
1. **依存関係の更新:** `npm outdated` 等の結果に基づき、Axiosのマイナーアップデートに伴う破壊的変更（Breaking Changes）がないかをリリースノート（CHANGELOG.md）から確認し、ユーザーに警告せよ。
2. **代替技術の検討:** プロジェクトが非常に小規模で、Axiosの高度な機能（インターセプター等）を一切使っていない場合は、バンドルサイズ削減のためにネイティブ `fetch` への差し替えを「選択肢」として提示せよ。
3. **ドキュメントの整合性:** 実装を変更した際は、本コンテキスト（01〜07）のどの定義に影響が出るかを常に監視し、ドキュメントの不整合を報告せよ。
