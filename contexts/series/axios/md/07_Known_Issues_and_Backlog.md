---
title: Known Issues and Backlog - Axios (Living Document)
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 07_Known_Issues_and_Backlog: Axios

> **実際のバグ・議論は GitHub Issues / Releases が正**。ここでは AI がコンテキストを欠かないための「典型論点」を固定する。

## 1. 既知の論点（概念的）

| 論点 | 概要 | 利用者側の実務対応 |
|------|------|---------------------|
| **fetch との意味差** | `fetch` は 404 を resolve することが多い一方、Axios は validateStatus 次第で reject されやすい | エラーハンドリング方針をドキュメント化 |
| **CancelToken から signal へ** | 旧 API と新 API の混在 | 新規コードは `AbortController` のみ |
| **バージョン差** | メジャー間で型・オプションが変わり得る | lockfile と型定義のバージョンをペアで管理 |
| **Node / Browser の能力差** | `stream`、`FormData`、プロキシ等は環境依存 | 「同じコードが両方で動く」と仮定しない |

## 2. 制限事項（ライブラリの責務外）

- **接続プールのチューニング**は Node の `http(s).Agent` 側（アプリが inject）。
- **リトライの完全な標準化** — あり/なしはバージョン・方針次第。自前 interceptor で明示することが多い。

## 3. バックログの追い方（運用ルール）

1. 依存 axios の **メジャー・マイナー**を記録する。
2. **Release notes** をマイナーアップデートでも読む（security fix のみのリリースに注意）。
3. Issue を引用する際は **再現コードと axios バージョン**をセットで貼る。

## 4. このプロジェクト（P&C シリーズ）のメモ

- 本ファイルは **教育用スナップショット**であり、最新の不具合一覧ではない。
- 正確な状態は https://github.com/axios/axios/issues を参照。

---

*定期的に「利用中バージョン」と照合し、古い記述を更新または削除すること。*
