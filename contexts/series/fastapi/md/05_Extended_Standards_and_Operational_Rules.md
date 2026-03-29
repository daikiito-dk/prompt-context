---
title: 05_Extended_Standards_and_Operational_Rules (Integrated Edition)
version: 0.x (Latest Stable)
priority: MEDIUM
category: operational-guidelines
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 05_Extended_Standards_and_Operational_Rules: FastAPI

## 1. 非同期処理とスレッドの運用指針 (Concurrency Strategy)
FastAPIの性能を最大化するための実行モデルの選択基準。AIは以下のルールを厳守すること。

* **I/O Bound (Async):** DB操作、外部API呼出、ファイルI/Oなど待ち時間が発生する処理は必ず `async def` を使用し、ライブラリも `httpx` や `motor` 等の非同期対応版を選択せよ。
* **CPU Bound (Sync):** 画像処理、複雑な計算、暗号化などは通常の `def` で定義せよ。FastAPIが外部スレッドプールで実行し、イベントループの停止を防ぐ。
* **No-Wait Tasks:** レスポンスを即座に返し、バックグラウンドで処理を継続したい場合は `BackgroundTasks` を活用せよ。

## 2. ディレクトリ構成の標準化 (Project Structure)
AIが新規プロジェクトやモジュールを作成する際のベースレイアウト。

```text
app/
├── main.py              # App初期化、例外ハンドラ登録
├── core/                # 設定(config.py), セキュリティ(auth.py)
├── api/                 # APIRouterによるエンドポイント定義
│   └── v1/
│       ├── api.py       # ルータの結合
│       └── endpoints/   # 機能ごとのPath Operation
├── schemas/             # Pydanticモデル (Request/Response)
├── models/              # SQLAlchemy / Tortoise 等のDBモデル
├── services/            # ビジネスロジック、外部連携
└── db/                  # セッション管理、ベースクラス
```

## 3. ミドルウェアと共通処理 (Cross-Cutting Concerns)

* **CORS Middleware:** フロントエンド（React/Vue等）からのアクセスを許可するための `CORSMiddleware` 設定を必須とする。
* **Logging Middleware:** リクエストID（`X-Request-ID`）を付与し、処理時間とステータスコードをログ出力する共通処理を実装せよ。
* **Custom Exception Handlers:** Pydanticの `ValidationError` 等をキャッチし、フロントエンドが扱いやすいカスタムJSON形式に変換するハンドラを `main.py` に集約せよ。

## 4. セキュリティ・ベストプラクティス

* **OAuth2 / JWT:** 認証には `OAuth2PasswordBearer` を使用し、トークンの検証ロジックを依存関係（Dependency）として分離せよ。
* **SQL Injection Prevention:** ORM（SQLAlchemy等）を利用し、生のSQLクエリ文字列結合を厳禁とする。
* **Sensitive Data Exposure:** `response_model` を活用し、`hashed_password` や内部用フラグがAPIレスポンスに含まれないことを保証せよ。

## 5. 運用とスケーラビリティ

* **Environment Variables:** `pydantic-settings` を使用して `Settings` クラスを作成し、環境変数のバリデーションを行え。
* **Gunicorn/Uvicorn:** 本番環境では Uvicorn worker を管理する Gunicorn の使用を前提とした設定（`workers`, `worker-class`）を提案せよ。

## 6. AIへの運用指示 (Operational Constraints)

* **循環参照の回避:** `models` と `schemas` が互いに import し合わないよう、型の定義位置に注意を払え（必要に応じて `TYPE_CHECKING` を使用せよ）。
* **パフォーマンスの可視化:** 処理が重いエンドポイントに対して、実行時間を計測する依存関係やミドルウェアの導入を提案せよ。
* **ドキュメントの質:** `@router` の `summary` や `description` に、そのエンドポイントの役割と副作用（どのDBテーブルが更新されるか等）を明記せよ。
