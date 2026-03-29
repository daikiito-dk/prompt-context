---
title: User Persona and Journey - Axios (Developer Personas)
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 08_User_Persona_and_User_Journey: Axios

> エンドユーザーではなく **Axios を触る開発者**をペルソナとする。  
> 「誰が・どんな疑問で・どこを読むか」を固定すると、ドキュメントとコード生成の質が上がる。

## 1. ペルソナ A — フロントエンド応用開発者

- **ゴール:** React/Vue 等から安全に API を叩き、認証ヘッダとエラー UI を統一したい。
- **典型の不安:** CORS、401 時のリフレッシュ、`fetch` との挙動差。
- **参照順:** Quick Start → インターセプター → エラーハンドリング。

## 2. ペルソナ B — Node バックエンド / BFF 担当

- **ゴール:** サーバから他サービスへ HTTP で連携し、タイムアウトとキャンセルを制御したい。
- **典型の不安:** Agent、プロキシ、`stream`、メモリ。
- **参照順:** instance 分離 → timeout/signal → 低レベルオプション。

## 3. ペルソナ C — ライブラリ作者・SDK メンテナ

- **ゴール:** 自前パッケージの内部 HTTP を Axios に集約し、テストをモックしやすくしたい。
- **典型の不安:** バンドルサイズ、依存セマバ、デフォルト instance のグローバル汚染。
- **参照順:** `create` による分離 → カスタム adapter（テスト）→ 型の配布方法。

## 4. 代表的ジャーニー：「初回 API 呼び出し」

| ステップ | 行動 | 期待する結果 |
|----------|------|----------------|
| 1 | `axios.get` または `instance.get` を試す | 200 と JSON が `data` に入る |
| 2 | 401 / 422 に遭遇 | AxiosError を捕捉し、ボディを解析 |
| 3 | トークン付与が必要に | request interceptor を追加 |
| 4 | コンポーネント破棄でキャンセル | `signal` を渡す |

## 5. 代表的ジャーニー：「本番障害調査」

| ステップ | 行動 | メモ |
|----------|------|------|
| 1 | `config`, `response` / `request` のどちらが埋まっているか確認 | ネットワーク前後で切り分け |
| 2 | `timeout` と `ECONNABORTED` を確認 | ユーザー体感は「遅い」だけ |
| 3 | Node なら DNS / プロキシ | Axios を超えた層の問題もある |

## 6. 離脱ポイント（サポートで効く説明）

- **「fetch では動くのに Axios だと落ちる」** → `validateStatus` と `response` の有無を説明。
- **「同じコードを Node とブラウザで」** → adapter 差と `FormData` / `Blob` の扱いを説明。

---

*実プロダクトのペルソナを足す場合は「アプリ利用者」用の 08 を別途切る。*
