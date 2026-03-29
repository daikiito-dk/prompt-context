# prompt-context

静的サイト用リポジトリ。プロンプト画面では **Copy** のたびに、任意で **共有スコア（全員分の集計）** をサーバーへ保存できます。

## 共有スコアの仕組み

- ブラウザは GitHub Pages などの静的ホスト上に置いたまま。
- **API だけ** [Vercel](https://vercel.com) にデプロイし、[Upstash Redis](https://upstash.com) にカウンタを保存します（`HINCRBY` で原子集計）。
- プロンプト一覧の `<body data-prompt-score-api="…">` に、API 用 Vercel のオリジンを書きます（末尾スラッシュ不要）。本リポジトリでは例として `https://prompt-context-zeta.vercel.app` を設定しています。

## API のデプロイ手順（例）

1. [Upstash](https://console.upstash.com) で Redis データベースを作成し、**REST URL** と **REST TOKEN** を控える。
2. リポジトリを Vercel にインポートする。
3. プロジェクトの **Environment Variables** に次を設定する:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. デプロイ後、`GET https://prompt-context-zeta.vercel.app/api/scores`（実際のプロジェクト URL に読み替え）が `{"scores":{...}}` を返せば OK。
5. `prompts/index.html` の `data-prompt-score-api` にそのオリジンを設定し、サイトを再デプロイまたは更新する。

### エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| `GET` | `/api/scores` | 全プロンプト ID の集計を JSON で取得 |
| `POST` | `/api/increment` | ボディ `{"id":"slug"}` でその ID のカウントを 1 増やす |

`id` は英数字・`_`・`-` のみ、最大 200 文字です。

### 注意

- エンドポイントは匿名で叩けるため、過剰な投稿には強くありません。必要なら Vercel のレート制限や共有シークレットの検証を足してください。
- ページと API のオリジンが異なるため、API 側では `Access-Control-Allow-Origin: *` で CORS を開いています。

## ローカル

```bash
npm install
# Upstash の環境変数を export してから（任意）
npx vercel dev
```
