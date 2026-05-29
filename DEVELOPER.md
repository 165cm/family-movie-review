# DEVELOPER.md — 家族で観る映画レビュー

開発者・コントリビューター向けの技術ドキュメントです。
エンドユーザー向け情報は [README.md](./README.md) を参照してください。

## 技術スタック

| 区分 | 内容 |
|---|---|
| 言語 | TypeScript |
| フレームワーク | Next.js 15 (App Router), React 19 |
| スタイリング | TailwindCSS, Framer Motion |
| データ | Notion API (`@notionhq/client`) |
| 外部 API | Amazon (アフィリエイト), YouTube |
| デプロイ | Vercel（主）/ Docker + Google Cloud Run（副） |

## セットアップ

```bash
git clone https://github.com/165cm/family-movie-review.git
cd family-movie-review
npm install
cp .env.example .env.local  # .env.example が無い場合は下記「環境変数」を参照
npm run dev
```

## 環境変数

| 変数名 | 必須 | 説明 |
|---|---|---|
| `NOTION_API_KEY` | ✅ | Notion Integration のシークレットキー |
| `NOTION_DATABASE_ID` | ✅ | レビューデータを管理する Notion データベースの ID |
| `NEXT_PUBLIC_BASE_URL` | ✅ | サイトのベース URL（例: `https://example.com`） |

## スクリプト

```bash
npm run dev        # 開発サーバー起動 (localhost:3000)
npm run build      # 本番ビルド（sitemap 生成含む）
npm run start      # 本番サーバー起動
npm run lint       # ESLint 実行
npm run test       # Jest テスト実行
npm run analyze    # バンドルサイズ分析
npm run docker:build  # Docker イメージビルド
npm run docker:run    # Docker コンテナ起動 (localhost:8080)
```

## ディレクトリ構成

```
src/
  app/
    components/      # UI コンポーネント
      ui/            # 汎用 UI パーツ
      MovieCard/     # 映画カード
      MovieDetail/   # 映画詳細
      FamilyScore/   # ファミリースコア
    api/             # Route Handlers (Next.js)
    lib/             # Notion API クライアント等
    types/           # 型定義
public/              # 静的アセット
docs/
  screenshots/       # README 用スクリーンショット格納場所
```

## デプロイ手順

**Vercel（通常デプロイ）**
- `main` ブランチへのプッシュで自動デプロイ
- 環境変数は Vercel ダッシュボードで設定

**Google Cloud Run（Docker デプロイ）**
- `cloudbuild.yaml` により Cloud Build が自動実行
- `Dockerfile` を参照してイメージをビルド

## AI 開発メモ

- AI エージェント向けの作業ルールは [.github/AGENTS.md](./.github/AGENTS.md) を参照
- 中央運用マニュアル: https://github.com/165cm/portfolio/tree/main/docs/standards

## ライセンス

MIT
