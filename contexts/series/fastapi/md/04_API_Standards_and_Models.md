---
title: 04_API_Standards_and_Models - FastAPI Technical Standards
version: 0.x (Latest Stable)
priority: HIGH
category: technical-specifications
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 04_API_Standards_and_Models: FastAPI Implementation Standards

## 1. データモデル規格 (Pydantic Models)
リクエストとレスポンスの型定義。AIは `BaseModel` を継承した以下のパターンを厳守すること。

| モデル種別 | 命名規則 | 役割 |
| :--- | :--- | :--- |
| **Request Schema** | `XxxCreate` / `XxxUpdate` | クライアントからの入力。バリデーションルールを詳細に記述。 |
| **Response Schema** | `XxxRead` / `XxxOut` | クライアントへの出力。`ORM_mode` (from_attributes) を有効化。 |
| **Internal Model** | `XxxInternal` | 内部処理用。ハッシュ化されたパスワードなど機密情報を含む。 |

### 実装例 (Schema Definition)
```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # ORMオブジェクトからの自動変換を許可
```

## 2. 依存性注入の標準パターン (Dependency Injection Patterns)
`Depends()` を用いた共通処理の構成。

* **DB Session:** `get_db` ジェネレータ関数を定義し、リクエスト終了時に自動でクローズされるように設計せよ。
* **Authentication:** `get_current_user` 依存関係を作成し、認証が必要なエンドポイントの引数に注入せよ。
* **Pagination:** クエリパラメータ（`limit`, `offset`）を構造化した `PaginationParams` クラスを定義し、DIとして利用せよ。

## 3. パス操作関数のシグネチャ (Path Operation Signatures)
AIがコードを生成する際の標準的なメソッド構成。

```python
from fastapi import APIRouter, Depends, status

router = APIRouter()


@router.post(
    "/users/",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Detailed explanation of the user creation process.",
)
async def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin),
):
    return user_service.create(db, user_in)
```

## 4. エラーレスポンスの統一規格 (Error Handling)
`HTTPException` を使用した、一貫性のあるエラー返却ルール。

* **標準形式:** `{"detail": "Error message string"}`
* **バリデーションエラー:** FastAPIが自動生成する 422 Unprocessable Entity の形式（`loc`, `msg`, `type` を含む構造）を尊重し、独自のバリデーションでもこの形式に準拠せよ。
* **カスタム例外:** アプリケーション固有の例外（例: `EntityNotFoundError`）を定義し、`exception_handler` で一括してHTTPレスポンスに変換せよ。

## 5. ステータスコードの利用基準
AIは以下の状況に応じた適切なコードを選択すること。

* **200 OK:** 成功した取得・更新。
* **201 Created:** 新規リソースの作成成功。
* **204 No Content:** 成功したが、返すコンテンツがない（削除時等）。
* **400 Bad Request:** クライアント側の一般的なエラー。
* **401 Unauthorized:** 認証が必要、または失敗。
* **403 Forbidden:** 権限不足。
* **404 Not Found:** リソースが存在しない。

## 6. AIへの実装ガイドライン (Technical Constraints)

* **`response_model` の必須化:** セキュリティ上の理由（意図しないデータの流出防止）から、必ず `response_model` を指定して出力をフィルタリングせよ。
* **型ヒントの活用:** 引数には必ず型ヒントを付与し、Pydanticによる自動バリデーションの恩恵を最大化せよ。
* **ビジネスロジックの分離:** パス操作関数内に直接DB操作や複雑な計算を書かず、`services/` レイヤーに委譲せよ。
