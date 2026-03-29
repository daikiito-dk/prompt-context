---
title: Coding and Git Rules - Axios (Contributor-Oriented)
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 06_Coding_and_Git_Rules: Axios

## 1. この文書の位置づけ

- **Axios 本体へコントリビュートする人**向けの規約は、**上流リポジトリの CONTRIBUTING / CI** が最優先。
- 本稿は **Axios を利用する製品側**の典型ルールと、上流で一般的と見られる作法をまとめたもの。

## 2. Axios 利用プロジェクトの命名・配置

| 対象 | 規約例 |
|------|--------|
| クライアントモジュール | `api/client.ts`, `http/axios.ts` など 1 入口に集約 |
| instance 名 | `api`, `authApi`, `billingApi`（用途が名前に出る） |
| ラッパー関数 | `getUser`, `createOrder` — **生の axios をコンポーネントから import しない** |

## 3. インターセプター規約

- **登録はアプリ起動時の 1 回**に限定（重複登録禁止）。
- request / response / error それぞれ **id（コメント）**を付け、削除・順序入替ができるようにする。

## 4. コミットメッセージ（アプリ側）

Conventional Commits 推奨の例：

- `fix(api): handle 401 in response interceptor`
- `feat(auth): add token refresh before retry`

## 5. テスト

- Adapter を **モック**し、**本物の HTTP に依存しない**ユニットテストを優先。
- E2E では MSW / サーバスタブなどで **ステータス別**を網羅。

## 6. セキュリティ

- **URL・クエリにトークンを載せない**方針を文書化（GET + `access_token` 禁止等）。
- `withCredentials` と CORS の組み合わせを README に明記。

## 7. 上流 axios 開発（参考）

- ESLint に従う。
- **ブラウザと Node の両方**で落ちない変更を意識。
- 破壊的変更はセマバとリリースノートで明示（利用者側の追従コストが高い）。

---

*PR ルールの詳細は https://github.com/axios/axios を参照。*
