---
title: API Standards and Models - Axios (Public API Surface)
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 04_API_Standards_and_Models: Axios

## 1. スコープ

ここでの「API」は **HTTP リソースの REST 設計**ではなく、**Axios がアプリケーションに公開する JavaScript API**（関数・オブジェクトの形）を指す。

## 2. エントリポイント

| シンボル | 説明 |
|----------|------|
| `axios` | デフォルトインスタンスとしても振る舞う関数。`axios(config)` = `request` |
| `axios.create([defaults])` | 独立したインタンスを生成 |
| `axios.defaults` | グローバル既定 Config |
| `axios.interceptors` | グローバルの request/response インターセプター |

### メソッド shorthand（すべて config にマップ）

`get`, `delete`, `head`, `options`  
`post`, `put`, `patch`（`data` を取る）

## 3. Config オブジェクト（主要キー）

実際のキー集合はバージョンで増減し得る。AI は **公式型定義・ドキュメント**と突き合わせること。

| キー | 役割 |
|------|------|
| `url` | リクエスト URL（`baseURL` と合成され得る） |
| `method` | HTTP メソッド（小文字文字列が一般的） |
| `headers` | リクエストヘッダ |
| `params` | クエリ（シリアライズ方針あり） |
| `data` | ボディ（オブジェクト時は JSON 化されやすい） |
| `timeout` | ミリ秒。0 は多くの場合「無制限」扱い |
| `responseType` | `json` / `text` / `blob` / `arraybuffer` / `stream`（環境依存） |
| `baseURL` | 基底 URL |
| `withCredentials` | CORS クッキー送付（XHR） |
| `adapter` | カスタム Adapter を指定 |
| `signal` | `AbortSignal` |
| `validateStatus` | 成功ステータスの範囲を返す関数 |

## 4. Response オブジェクト（概念モデル）

| フィールド | 説明 |
|------------|------|
| `data` | レスポンスボディ（transform 適用後） |
| `status` | HTTP ステータスコード |
| `statusText` | ステータステキスト |
| `headers` | レスポンスヘッダ |
| `config` | 当該リクエストに使われた Config |
| `request` | 低レイヤーのリクエストオブジェクト（環境依存） |

## 5. エラー（AxiosError）

| フィールド / 概念 | 説明 |
|-------------------|------|
| `message` | 人間可読メッセージ |
| `code` | 文字列コード（例: `ECONNABORTED`）場合あり |
| `config` | 失敗したリクエストの Config |
| `response` | ステータス付きで返ってきた場合（4xx/5xx のボディ解析に使う） |
| `request` | 応答なしで失敗した場合など |

**命名規則:** 公開APIの**オプション名は camelCase**（`responseType`, `maxBodyLength` 等）が基本。

## 6. インターセプター契約

```text
request:  (config) => config | Promise<config>
response: (response) => response | Promise<response>
error:    (error) => throw | Promise.reject | 回復
```

**規約:** エラーを**飲み込む** interceptor は、チームで明示的に許可しない限り禁止（上流が壊れる）。

## 7. セマンティックバージョニング

Axios 本体は npm の **セマバ** に従う前提で、**メジャーで破壊的変更があり得る**。  
AI は「そのプロジェクトが依存している axios のメジャー」を必ず確認する。

---

*実キー一覧は利用中の `axios` のバージョンと TypeScript の型定義を最終ソースとする。*
