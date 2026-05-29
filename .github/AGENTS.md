# AI Coding Agent Guide

このリポジトリでの開発作法は、**中央マニュアル** に従ってください。

📘 中央マニュアル: https://github.com/165cm/portfolio/tree/main/docs/standards

- [tiers.md](https://github.com/165cm/portfolio/blob/main/docs/standards/tiers.md) — 作品ティア
- [commits.md](https://github.com/165cm/portfolio/blob/main/docs/standards/commits.md) — コミット規約
- [readme-template.md](https://github.com/165cm/portfolio/blob/main/docs/standards/readme-template.md) — README 規約
- [developer-template.md](https://github.com/165cm/portfolio/blob/main/docs/standards/developer-template.md) — DEVELOPER 規約
- [topics.md](https://github.com/165cm/portfolio/blob/main/docs/standards/topics.md) — Topics 規約
- [ops.md](https://github.com/165cm/portfolio/blob/main/docs/standards/ops.md) — その他運用ルール

## このリポジトリ固有の情報

- **Tier**: T3（tier-product）
- **Category**: family
- **特有の制約**:
  - Notion API でレビューデータを取得しているため、`src/app/lib/` 配下のデータ取得ロジック変更は慎重に
  - Vercel デプロイ前提（`NOTION_API_KEY` 等の環境変数が必須）
  - 家族向けサービスのため、コンテンツ・UI の変更は利用者（子ども含む）への影響を考慮すること
  - PRIVACY.md に記載した Notion 連携のデータ利用方針を遵守すること

## このリポジトリでよく使うコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run test     # テスト実行
npm run lint     # Lint チェック
```
