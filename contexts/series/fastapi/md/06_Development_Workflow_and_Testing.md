---
title: 06_Development_Workflow_and_Testing
version: 0.x (Latest Stable)
priority: MEDIUM
category: testing-and-workflow
tech_stack:
  - pytest
  - httpx
  - TestClient
  - OpenAPI
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 06_Development_Workflow_and_Testing: FastAPI

## 1. テスト戦略の標準化 (Testing Strategy)
FastAPIアプリケーションの信頼性を担保するためのテスト階層。

* **Unit Tests:** `services/` や `utils/` のロジックを単体で検証。DB接続を伴わない純粋な関数を対象とする。
* **Integration Tests (Endpoint Tests):** `fastapi.testclient.TestClient` を使用し、リクエストからレスポンスまでの一連の流れ（バリデーション、DI、処理、シリアライズ）を検証。
* **Database Testing:** テスト用のDB（SQLiteのインメモリ等）を別途用意し、`app.dependency_overrides` を使って本番DB接続をテスト用セッションに差し替えよ。

## 2. テスト実装のベストプラクティス
AIが `pytest` を用いたテストコードを生成する際の標準。

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    # 正常系の検証
    response = client.post(
        "/users/",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"

def test_create_user_invalid_data():
    # Pydanticバリデーション（異常系）の検証
    response = client.post("/users/", json={"username": "t"})  # 短すぎる
    assert response.status_code == 422
```

## 3. OpenAPIドキュメントの高度なカスタマイズ
`/docs` (Swagger UI) を単なる自動生成に留めず、開発資料として完成させるためのメタデータ管理。

* **Tagging:** `@router.post(..., tags=["users"])` のように、エンドポイントを論理的なグループに分類せよ。
* **Response Examples:** Pydanticモデルの `Config` または `Field(json_schema_extra={...})` を使用し、ドキュメント上に具体的なリクエスト/レスポンスの例を表示させよ。
* **Metadata:** `FastAPI(title="...", description="...", version="...")` を設定し、APIの全体像（認証方法やレートリミット等）を記述せよ。

## 4. デバッグとプロファイリング

* **Interactive Docs:** 修正後は必ず `/docs` でリクエストを試行し、バリデーションエラー（422）の詳細な `loc` (Location) を確認して原因を特定せよ。
* **Middleware Logging:** 開発時はリクエスト毎の処理時間を計測するミドルウェアを有効にし、ボトルネックを特定せよ。

## 5. ローカル開発ワークフロー

* **Reloading:** `uvicorn app.main:app --reload` によるホットリロード環境での開発を前提とする。
* **Linting/Formatting:** `ruff` や `mypy` を使用し、型ヒントの不整合や未使用のインポートを静的に検知せよ。

## 6. AIへの運用指示 (Workflow Constraints)

* **テストの並行生成:** 新しいエンドポイントの実装を提案する際は、必ずそれに対応する `pytest` のコードもセットで提示せよ。
* **依存関係のオーバーライド:** DB接続を伴うテストでは、必ず `dependency_overrides` を用いたクリーンなテスト環境の構築手順を含めよ。
* **ドキュメントの充実:** ドキュメントに表示される「説明文」が不足している場合、`summary` や `response_description` を追加して補完せよ。
