---
title: 04_API_Standards_and_Models (Full Edition)
version: 1.x (Current Stable)
priority: HIGH
category: api-reference-and-conventions
last_updated: 2026-03-30
source_repo: https://github.com/axios/axios
---

# 04_API_Standards_and_Models: Axios Full Specifications

## 1. リクエスト設定モデル (AxiosRequestConfig)
すべてのメソッドの基盤となる設定オブジェクト。AIは実装時、以下のプロパティを優先的に参照し、型の一貫性を保つこと。

| プロパティ | 型 | 役割・デフォルト値 |
| :--- | :--- | :--- |
| `url` | `string` | リクエスト先パス。`baseURL` がある場合は結合される。 |
| `method` | `string` | `get` (default), `post`, `put`, `delete` 等。 |
| `baseURL` | `string` | インスタンス共通の基点URL。 |
| `headers` | `object` | カスタムヘッダー。`{'Content-Type': 'application/json'}` 等。 |
| `params` | `object` | URLクエリ（`?id=123`）に変換されるオブジェクト。 |
| `data` | `any` | リクエストボディ。POST/PUT時に送信される実体。 |
| `timeout` | `number` | ミリ秒指定。0（制限なし）がデフォルト。 |
| `responseType` | `string` | `json` (default), `blob`, `text`, `stream` 等。 |

## 2. レスポンスデータモデル (AxiosResponse)
通信成功時にPromiseから返却される正規化されたオブジェクト構造。

* **`data: T`**: サーバーからのレスポンスボディ。`transformResponse` 適用後の最終データ。
* **`status: number`**: HTTPステータスコード（例: 200, 201）。
* **`statusText: string`**: HTTPステータスメッセージ（例: "OK"）。
* **`headers: RawAxiosResponseHeaders`**: レスポンスヘッダー（キーは小文字に正規化済み）。
* **`config: AxiosRequestConfig`**: 送信時に使用された全設定。
* **`request: any`**: 実際に送信されたリクエストの実体（XHRまたはhttpインスタンス）。

## 3. 関数シグネチャと実用パターン (Method Signatures)
AIがコード生成を行う際の「書き方の型」。

### 3.1. インスタンス生成
```javascript
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});
```

### 3.2. 各メソッドの引数ルール
**引数2つのパターン (GET/DELETE/HEAD/OPTIONS)**

```text
axios.get(url[, config])
```

**引数3つのパターン (POST/PUT/PATCH)**

```text
axios.post(url[, data[, config]])
```

※注意: `config` は必ず第3引数となる。データがない場合は `null` を渡す必要がある。

## 4. エラーオブジェクト構造 (AxiosError)
例外処理（catch）時にAIが参照すべきプロパティ群。

* **`code`**: 文字列形式のエラーコード（例: `ERR_NETWORK`, `ECONNABORTED`）。
* **`response`**: サーバーがエラーレスポンスを返した場合の `AxiosResponse`。
* **`isAxiosError`**: `true` 固定。型判定に使用。
* **`toJSON()`**: エラー情報をシリアライズするためのメソッド。

## 5. データ変換パイプライン (Transformer Logic)
データの「送出前」と「受け取り後」の加工ルール。

* **`transformRequest`**: `Array<(data: any, headers: any) => any>`  
  送信前にデータを文字列化、あるいは暗号化する。
* **`transformResponse`**: `Array<(data: any) => any>`  
  受信したJSONをクラスインスタンスに変換する等の処理を行う。

## 6. 設定の継承と優先順位 (Config Hierarchy)
AIが「どこで設定を変更すべきか」を判断する基準。

* **Global Default:** `axios.defaults`（最低優先度）
* **Instance Config:** `axios.create({ ... })` で渡した値
* **Request Config:** 個別の `axios.post(url, data, { ... })` で渡した値（最高優先度）

## 7. 実装におけるAIへの強制事項 (Hard Constraints)
1. **型安全:** TypeScriptでは `AxiosResponse<MyDataType>` のように、常に期待するデータ型を明示せよ。
2. **エラーガード:** `if (axios.isAxiosError(error))` を使用して、安全にエラープロパティへアクセスせよ。
3. **冗長性の排除:** デフォルトの `method: 'get'` や `responseType: 'json'` を明示的に書くことは避け、コードを簡潔に保て。

---

## 8. この統合版のポイント
* **一貫性:** インスタンス生成からエラー処理まで、開発の「一連の流れ」を一つのmdに集約した。
* **トークン効率:** 日本語の解説とコードブロックをバランスよく配置し、約1,700トークンに収めている。
* **AIの誤認防止:** 特に「POSTの第2引数と第3引数の取り違え」というAIに多いミスを明文化して封じ込めている。
