---
title: Domain Dictionary - Axios
priority: CRITICAL
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 03_Domain_Dictionary: Axios

> プロンプト・仕様・コード生成で **この表の用語だけ** を「正式」として扱う。  
> 一般的な HTTP 用語と Axios 固有の意味がずれたときは **こちらを優先**する。

## 正式用語一覧

| 用語 | 定義 | 注意（禁止・紛らわしい呼び方） |
|------|------|----------------------------------|
| **Config** | 1 回のリクエストまたはインスタンス既定に効く、URL・method・headers・data・timeout 等の集合体 | 「オプション」とだけ言わない。Config と明記 |
| **Defaults** | `axios.defaults` および `create` 時に与えた既定の Config | 「グローバル設定」単体より defaults と書く |
| **Instance** | `axios.create(defaults)` で得た、defaults / interceptors を独立に持つクライアント | **Axios インスタンス** ≠ HTTP の「接続プール」 |
| **Adapter** | 実際にネットワーク I/O を行う最下層（XHR / Node http 等） | 「ドライバー」「バックエンド」など曖昧語を避ける |
| **Interceptor** | request または response のチェーンに挿入する middleware 的フック | Express の middleware と**同型ではない**（Promise チェーン） |
| **dispatchRequest** | インターセプター処理後に Adapter を呼ぶ内部経路 | ユーザーコードから直接呼ばない |
| **TransformRequest** | **送信前**に data を加工する関数（配列で複数） | body の「シリアライズ方針」と混同しない |
| **TransformResponse** | **受信後**に data を加工する関数 | `response.data` 確定後の加工 |
| **AxiosError** | 失敗時に投げられるエラーオブジェクト。`response`・`request`・`config` を持ち得る | 素の `Error` と区別 |
| **signal** | `AbortController` の `AbortSignal`。キャンセル伝播に使う | `CancelToken` は**レガシー**。新規は signal |
| **baseURL** | 相対 `url` と結合される基底 | 「ホスト名」だけではない（path プレフィックスを含み得る） |

## HTTP ステータスと Axios の振る舞い（用語）

| 用語 | 意味 |
|------|------|
| **validateStatus** | どのステータスを「成功」として resolve するかを決める関数。デフォルトは 2xx |
| **reject on 非 2xx** | デフォルトでは 2xx 外で Promise が reject → `try/catch` で捕捉可能 |

## よくある誤解

- **「Axios が JSON を送る」** → 正確には **オブジェクトを渡すと transform + Content-Type により JSON 化されやすい**。
- **「fetch と同じで 404 は成功」** → Axios のデフォルト挙動は **validateStatus 次第**だが、多くのチームは 2xx 外を reject として扱う（fetch との差の源泉）。

---

*01_Product_Core_Concept のセクション 5 も参照。重複する定義は 01/03 のどちらかを「正」と決めてプロジェクトで統一すること。*
