---
title: DX / Public Surface "Design System" - Axios
note: Library has no end-user UI; this document is developer-facing DX.
source_repo: https://github.com/axios/axios
last_updated: 2026-03-30
---

# 05_UI_UX_Design_System: Axios

> Axios は**エンドユーザー向け UI を持たないライブラリ**である。  
> 本稿では「UI/UX」を **Developer Experience (DX)** として扱い、**公開 API・エラー・ドキュメント・型**の一貫性を design system と呼ぶ。

## 1. DX の原則

1. **一貫した Config モデル** — どのメソッドも最終的に同じ `config` の概念に落ちる。
2. **驚き最小** — 2xx 外は（デフォルト設定下では）reject し、fetch の「成功扱い」との差をコメントで説明できるようにする。
3. **フックポイントの可視化** — interceptor / transform / adapter のどこで副作用を入れるかをドキュメント化する。

## 2. 「コンポーネント」相当の部品

| 部品 | 役割 | 利用時のルール |
|------|------|----------------|
| **Default instance** | 小規模スクリプト向け | アプリ本番は `create` で分離推奨 |
| **Named instance** | マイクロサービス別 baseURL 等 | ファイル単位で 1 インスタンスに集約 |
| **Interceptor モジュール** | 認証・ロギング | 登録順序を README に書く |
| **Error normalizer** | AxiosError → アプリ共通エラー型 | `response`、`code` のどちらを見るか固定 |

## 3. メッセージ・エラー体験

- **ユーザー向け文言には Axios の `message` をそのまま出さない**（内部 URL やスタックが混じり得る）。
- アプリ側で **構造化**したエラーコードにマップする。

## 4. ドキュメント・型の「ルール」

- README に載っている例を **唯一の正** とみなさず、**プロジェクトのラッパー**の例を別途用意する。
- TypeScript 利用時は **公式型 / DefinitelyTyped** の差異に注意（バージョン組み合わせでズレる）。

## 5. 「見た目」に相当するもの

- **ログ出力フォーマット**（開発時）：`config.method`, `config.url`, `status`, `duration` を 1 行に統一する等。
- **OpenAPI / Swagger** との組み合わせ：生成クライアントを Axios でラップする場合は **境界のファイル**だけに Axios を閉じ込める。

## 6. アンチパターン（DX 破壊）

- 同一コードベースで **デフォルト instance と複数 create 混在**し、interceptors が追えない。
- interceptor 内で **window.alert** や **ルータ遷移**を直書き（テスト不能）。

---

*GUI デザインシステムが必要なのは「Axios を使うアプリ」側。アプリ用の 05 は別ファイルで管理すること。*
