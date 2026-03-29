# 04 — API Standards and Models（データモデルと API 規格）

> **目的**: 実装・レビュー・AI 生成コードが **同じ形のエンティティとエラー** を前提にできるようにする。

## 1. 主要エンティティ（概念モデル）

### Entity: （例: Member）

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | UUID | ✓ | |
| | | | |

### Entity: （例: Project）

（同様の表）

## 2. API 設計原則

- **ベース URL**: （例: `https://api.example.com/v1`）
- **認証**: （ヘッダー名、Bearer / Cookie など）
- **Idempotency**: （必要なメソッドとキー）
- **ページネーション**: （cursor / offset、上限）

## 3. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| パス | kebab-case / 複数形 | `/members`, `/member-events` |
| JSON フィールド | camelCase / snake_case（統一して1つ） | |
| 列挙値 | SCREAMING_SNAKE 等 | |

## 4. 共通エラーレスポンス

```json
{
  "error": {
    "code": "STRING_MACHINE_READABLE",
    "message": "人間向け短文",
    "details": {}
  }
}
```

- **HTTP ステータスと code の対応表**:

| HTTP | code 例 | 意味 |
|------|---------|------|

## 5. バージョニング・非互換変更

-

---

*最終更新: YYYY-MM-DD*
