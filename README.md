# 家族で観る映画レビュー

## 概要
家族向け映画レビューサイト

## 技術スタック
- Next.js 14 (App Router)
- Notion API
- TailwindCSS
- Vercel

## 開発環境のセットアップ
1. リポジトリのクローン
```git clone https://github.com/your-username/family-movie-review.git```

2. 依存関係のインストール
```npm install```

3. 環境変数の設定
.env.exampleをコピーして.env.localを作成し、必要な値を設定

4. 開発サーバーの起動
```npm run dev```

## 環境変数
- NOTION_API_KEY: NotionのAPI Key
- NOTION_DATABASE_ID: レビュー情報を管理するデータベースID
- NEXT_PUBLIC_BASE_URL: サイトのベースURL