---
title: 03_Domain_Dictionary - FastAPI Terminology
version: 0.x (Latest Stable)
priority: CRITICAL
category: dictionary
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 03_Domain_Dictionary: FastAPI Specific Terminology

## 1. コア・エンティティ (Core Entities)
AIがコードの構造を設計する際に、役割を厳格に分けるべき基本用語。

| 用語 | 定義 | AIへの指示 |
| :--- | :--- | :--- |
| **Path Operation** | パス（URL）とHTTPメソッド（GET/POST等）に対応する関数。 | `@app.get` 等のデコレータが付与された「入り口」として扱うこと。 |
| **Pydantic Model** | `BaseModel` を継承したクラス。データの「形」を定義する。 | リクエストの解析（パース）とレスポンスの整形（シリアライズ）の主役とせよ。 |
| **Dependency (依存関係)** | `Depends()` を通じて注入される関数や呼び出し可能オブジェクト。 | 認証、DB接続、クエリパラメータの共通化など「再利用可能なロジック」として定義せよ。 |
| **APIRouter** | ルートを分割管理するための仕組み。 | 大規模開発において、機能をモジュールごとに「フォルダ分け」する単位として扱うこと。 |

## 2. データ変換とバリデーション (Data Handling)
データの「通り道」で発生する処理の専門用語。

* **Parsing (パース):**
    * 定義: 文字列（JSON等）をPythonのデータ型（int, datetime, Model等）に変換すること。
    * 文脈: FastAPIは「バリデーション」だけでなく「パース」も同時に行う。
* **Serialization (シリアライズ):**
    * 定義: PythonオブジェクトをJSON形式（文字列/辞書）に変換すること。
    * 文脈: `response_model` を通じて、クライアントに返すデータをフィルタリング・整形する。
* **Field / Query / Path / Body:**
    * 定義: データのソース（出所）を明示するためのクラス。
    * 文脈: `Query(..., max_length=50)` のように、型ヒント以上の詳細な制約を付与する際に使用。

## 3. 非同期と並行処理 (Concurrency)
実行モデルに関連する重要な用語。

* **Event Loop:**
    * `async def` 関数が実行されるシングルスレッドのループ。I/O待ちを効率的に処理する。
* **Thread Pool:**
    * 通常の `def` 関数をブロックせずに実行するために、FastAPIが内部で利用するサブスレッドの集まり。
* **ASGI (Asynchronous Server Gateway Interface):**
    * WSGIの後継。非同期Webサーバー（Uvicorn等）とアプリケーションを繋ぐ標準規格。

## 4. 認証と認可 (Security)
`fastapi.security` モジュールに関連する定義。

* **OAuth2PasswordBearer:**
    * トークン（JWT等）の場所を指定する仕組み。URLやヘッダーからトークンを抽出する。
* **Security Scopes:**
    * ユーザーの権限（admin, read, write等）を細かく制御するための仕組み。

## 5. コンテキスト共有のためのエイリアス (Contextual Aliases)
AIが自然言語で指示を受けた際に、以下の単語をFastAPIの特定の機能と紐付けること。

* **"Middleware"** → HTTPリクエスト/レスポンスの前後で実行される「アプリ全体」の共通処理。
* **"Payload"** → `Body()` または Pydanticモデルとして定義されるリクエスト本体。
* **"Provider / Injector"** → `Depends()` による依存性注入。
* **"Schema"** → Pydanticモデルによるデータ定義。

---
## 6. AIへの運用指示 (Dictionary Enforcement)
1. **用語の統一:** 内部変数やドキュメント文字列（Docstring）を作成する際は、上記用語（`Path Operation`, `Schema`, `Dependency`）を優先的に使用せよ。
2. **モデルとエンティティの区別:** データベースのテーブル定義（ORM Entity）と、APIの入出力定義（Pydantic Schema）を混同せず、明確に分離して命名せよ（例: `User` vs `UserCreate`）。
3. **エラーメッセージの解釈:** `422 Unprocessable Entity` が発生した際は、Dictionaryの「Parsing」または「Validation」のどちらに問題があるかを特定せよ。
