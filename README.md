# AI Scheduler MVP – Proof‑of‑Concept Code

このリポジトリには、AI スケジューリング MVP 試作品 #1 の基本的なファイル構成が含まれています。環境によって Next.js や Supabase CLI などの実行が制限されるため、本リポジトリでは主要なコードスケルトンのみを提供します。実際の開発環境でこのコードを基にプロジェクトを構築してください。

## フォルダ構成

```
ai-scheduler/
├── supabase/
│   ├── schema.sql         # tasks テーブルのスキーマ定義
│   └── functions/
│       └── webhook.ts    # Google Calendar watch の通知を処理するサーバーサイド関数
├── src/
│   └── lib/
│       ├── ai.ts         # OpenAI API を用いて todo リストをタスクに分解する関数
│       └── gcal.ts       # Google Calendar へイベントを書き込むユーティリティ関数
└── README.md             # このファイル
```

## 使用方法

1. **Next.js プロジェクトの作成**

   本リポジトリには Next.js のテンプレートは含まれていません。`npx create-next-app@latest ai-scheduler` などで Next.js プロジェクトを初期化し、上記のファイルを `ai-scheduler` 配下に統合してください。

2. **Supabase スキーマの適用**

   `supabase/schema.sql` に定義されている `tasks` テーブルを Supabase プロジェクトに適用してください。Supabase CLI がインストールされている環境では次のコマンドで反映できます。

   ```bash
   supabase db push
   supabase gen types typescript --local > src/types_db.ts
   ```

3. **環境変数の設定**

   `.env.local` などに以下の環境変数を設定してください。

   - `SUPABASE_URL` / `SUPABASE_ANON_KEY` – Supabase プロジェクトのキー
   - `OPENAI_API_KEY` – OpenAI API キー
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – Google OAuth2 クライアントの資格情報

4. **実装を Next.js に統合**

   `src/lib/ai.ts` と `src/lib/gcal.ts` に示した関数は、Next.js の API Routes やフロントエンドの呼び出しロジックに組み込むことを想定しています。必要に応じて `app/(dashboard)/` や `pages/api/` 配下に API ハンドラーを追加し、ユーザーの todo 入力やタスクの登録を行ってください。

5. **Google Calendar Watch 関数**

   `supabase/functions/webhook.ts` は、Google Calendar API の Webhook から通知を受け取るためのエッジ関数です。Supabase エッジ関数としてデプロイし、`/api/gcal/webhook` などで Google に登録します。

## 注意事項

このリポジトリはあくまでコードスケルトンであり、実行するには外部サービス (Supabase、OpenAI、Google Calendar) へのアクセス設定や依存パッケージのインストールが必要です。実際のデプロイ時には Vercel や Supabase に環境変数を設定し、認証やセキュリティ設定を適切に行ってください。