---
title: 02_Architecture_Overview - FastAPI Internal Flow
version: 0.x (Latest Stable)
priority: HIGH
category: technical-architecture
tech_stack: [ASGI, Starlette, Pydantic, Dependency Injection]
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 02_Architecture_Overview: FastAPI System Mechanics

## 1. アーキテクチャの階層構造 (Layered Architecture)
FastAPIは独立したライブラリの組み合わせによって構成されている。AIは実装時、どのレイヤーで処理が行われているかを意識すること。

* **Layer 1: ASGI Server (Uvicorn/Hypercorn)**
    * ネットワークソケットを管理し、HTTPプロトコルをパースしてASGIスコープに変換する。
* **Layer 2: Web Framework (Starlette)**
    * ルーティング、リクエスト/レスポンス、クッキー、状態管理を担当。
* **Layer 3: Data Validation (Pydantic)**
    * Pythonの型ヒントに基づき、リクエストデータのパース、バリデーション、レスポンスのシリアライズを行う。
* **Layer 4: FastAPI Core**
    * 上記を統合し、Dependency Injection (DI) システムと OpenAPI (Swagger) の自動生成を追加する。

## 2. リクエスト・ライフサイクル (The Request-Response Cycle)
一つのHTTPリクエストが処理されるプロセスは以下の通り。

1.  **Request Arrival:** ASGIサーバーがリクエストを受信。
2.  **Routing:** StarletteがURLとメソッドに基づき、対応する `Path Operation Function` を特定。
3.  **Dependency Resolution:** `Depends()` で定義された依存関係をグラフとして解析し、再帰的に実行（認証、DBセッション取得など）。
4.  **Data Parsing & Validation (Pydantic):**
    * パスパラメータ、クエリ、ボディ、ヘッダーを抽出し、型ヒント（Pydanticモデル）と照合。
    * 失敗した場合は `422 Unprocessable Entity` を自動返却。
5.  **Function Execution:** バリデーション済みのデータが引数として渡され、関数が実行される（`async` ならイベントループ上で非同期実行）。
6.  **Response Serialization:** 関数の戻り値を `response_model` に基づいてJSONへ変換。
7.  **Output Validation:** レスポンスデータが型定義に沿っているか最終確認。
8.  **Response Delivery:** ASGI経由でクライアントへ送信。

## 3. Dependency Injection (DI) システムの特性
FastAPIのDIは「階層的で再利用可能な関数」の鎖（Chain）である。

* **階層性:** 依存関係が別の依存関係を持つことができる（例: API関数 -> ユーザー認証 -> DB接続）。
* **キャッシュ:** 同一リクエスト内で同じ依存関係が複数回呼ばれる場合、一度計算された結果が再利用される。
* **サブクラス/オーバーライド:** テスト時に `app.dependency_overrides` を使うことで、DB等を容易にモック化できる。

## 4. 並行処理モデル (Concurrency Model)
AIは関数の定義方法（`async def` vs `def`）を以下の基準で判断せよ。

* **`async def`:** I/O待ち（DB, 外部API）が発生する場合に使用。イベントループをブロックせず、高い並行性を維持する。
* **`def` (通常関数):** CPUバウンドな処理や、外部ライブラリが非同期非対応の場合に使用。FastAPIはこれらを**別スレッド（ThreadPool）**で実行し、メインループの停止を防ぐ。

## 5. 自動ドキュメント生成の仕組み
FastAPIは、実行時に `app.openapi()` を呼び出し、内部のルート定義とPydanticモデルをスキャンしてJSON形式のOpenAPIスキーマを生成する。このスキーマが `/docs` (Swagger UI) に動的に反映される。

## 6. ディレクトリ構造のベストプラクティス (App Structure)
大規模開発において推奨される構成。

* `main.py`: アプリケーションの初期化と `APIRouter` の結合。
* `api/`: ルーティング定義（v1, v2など）。
* `schemas/`: Pydanticモデル（リクエスト/レスポンスの型定義）。
* `models/`: データベースモデル（ORMエンティティ）。
* `services/`: ビジネスロジック。
* `dependencies.py`: 共通のDI関数。

---
## 7. AIへのコンテキスト指示
1. **リクエスト解析:** バグ修正時、エラーが「Starletteのルーティング段階」なのか「Pydanticのバリデーション段階」なのかを切り分けて思考せよ。
2. **パフォーマンス最適化:** スレッドプール（`def`）とイベントループ（`async def`）の使い分けを誤っているコードを検知し、修正案を提示せよ。
3. **DIの設計:** 共通処理を直接関数内に書くのではなく、`Depends()` を用いたDIへの分離を常に推奨せよ。
