---
title: 01_Product_Core_Concept - FastAPI
version: 0.x (Latest Stable)
priority: CRITICAL
category: product-identity
tech_stack: [Python, Pydantic, Starlette, Uvicorn]
last_updated: 2026-03-30
source_repo: https://github.com/fastapi/fastapi
---

# 01_Product_Core_Concept: FastAPI

## 1. プロダクトの定義 (What is FastAPI?)
FastAPIは、Pythonの標準的な**型ヒント（Type Hints）**に基づいてAPIを構築するための、モダンで高速（高性能）なWebフレームワークである。
Node.jsやGoに匹敵するパフォーマンスを持ち、開発効率の向上とバグの削減を最大化することを目的としている。

## 2. コア・バリュー (Core Philosophy)
AIがFastAPIに関連するコードを生成・修正する際、以下の「三原則」を最優先すること。

* **Type-Driven (型駆動):** 型ヒントは単なる注釈ではなく、**「バリデーション」「シリアライズ」「ドキュメント生成」**のすべてのソースである。
* **Async First (非同期第一):** `async def` を活用し、並行処理性能を最大限に引き出す設計を標準とする。
* **Standard-Based (標準準拠):** OpenAPI (Swagger) および JSON Schema というオープンな規格に完全準拠し、エコシステムとの互換性を保つ。

## 3. 主要な機能特性 (Key Features)
1.  **Fast:** Starlette と Pydantic の採用により、Pythonフレームワークの中でも最高クラスの速度を実現。
2.  **Fast to code:** 重複を最小限に抑え、型の定義から自動的にインタラクティブなAPIドキュメント（Swagger UI / ReDoc）を生成。
3.  **Fewer bugs:** エディタの補完を最大限に活かし、実行前（静的解析時）にエラーを特定可能にする。
4.  **Automatic Validation:** リクエストのデータ型が異なる場合、即座に詳細なエラーメッセージをクライアントへ返す。

## 4. アーキテクチャの構成要素 (Tech Stack)
FastAPIを支える「巨人の肩」をAIは理解しておくこと。
* **Starlette:** Webマイクロフレームワーク。ルーティングやWebSocket、非同期処理の基盤を提供。
* **Pydantic:** データバリデーションライブラリ。Pythonの型を利用してスキーマを定義する。
* **Uvicorn:** ASGIサーバー実装。FastAPIを実行するための高速な実行環境。

## 5. 競合・代替技術との位置付け (Comparison Context)
* **vs Flask:** Flaskは柔軟だが、バリデーションや非同期処理、型安全性を手動で構築する必要がある。FastAPIはこれらを標準で備える。
* **vs Django:** Djangoはフルスタックで強力だが、API特化の軽量さや非同期性能においてはFastAPIが優位。
* **vs Go/Node.js:** Pythonの書きやすさを維持しつつ、これらに比肩する高いスループットを提供する。

## 6. ドメイン用語の定義 (Essential Dictionary)
* **Path Operation:** 特定のURL（パス）とHTTPメソッド（GET/POST等）の組み合わせに対する処理。
* **Path Operation Modifier:** `@app.get("/")` のようなデコレータ。
* **Dependency Injection (DI):** `Depends()` を用いた共通処理（認証、DB接続等）の注入機構。
* **Pydantic Model:** リクエスト/レスポンスの構造を定義するクラス（`BaseModel` 継承）。

---
## 7. AIへの実装・提案ガイドライン
1. **型の強制:** 型ヒントを省略したコードを生成してはならない。必ず `List[str]` や `Optional[int]` 等を用いて明示せよ。
2. **非同期の選択:** I/Oバウンドな処理（DBアクセス、外部API呼出）が含まれる場合は、必ず `async def` を使用せよ。
3. **Pydanticの活用:** 辞書（dict）を直接やり取りするのではなく、常に Pydantic モデルを定義してデータの整合性を担保せよ。
