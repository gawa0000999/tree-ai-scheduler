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
│   ├── lib/
│   │   ├── ai.ts               # OpenAI API を用いて todo リストをタスクに分解する関数
│   │   └── gcal.ts             # Google Calendar へイベントを書き込むユーティリティ関数
│   └── pages/
│       └── api/
│           ├── splitTasks.ts   # POST エンドポイント: todo リストをタスク配列へ変換
│           └── schedule.ts     # POST エンドポイント: タスクを Google カレンダーへ登録
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

   `src/lib/ai.ts` と `src/lib/gcal.ts` に示したユーティリティ関数は、Next.js の API Routes から利用できます。既にサンプル実装として次の API エンドポイントを用意しています。

   - `POST /api/splitTasks` : ボディに `input` プロパティを含めると、OpenAI に送信してタスク配列を返します。
   - `POST /api/schedule` : ボディに `tokens`（Google OAuth トークン）と `tasks`（タスク配列）を含めると、そのタスクを Google カレンダーへ登録します。

   フロントエンドではテキストエリアに貼り付けた todo リストを `/api/splitTasks` に送信し、返ってきたタスクを `/api/schedule` へ送ることで自動的にカレンダーに登録することができます。

5. **Google Calendar Watch 関数**

   `supabase/functions/webhook.ts` は、Google Calendar API の Webhook から通知を受け取るためのエッジ関数です。Supabase エッジ関数としてデプロイし、`/api/gcal/webhook` などで Google に登録します。

## 注意事項

このリポジトリはあくまでコードスケルトンであり、実行するには外部サービス (Supabase、OpenAI、Google Calendar) へのアクセス設定や依存パッケージのインストールが必要です。実際のデプロイ時には Vercel や Supabase に環境変数を設定し、認証やセキュリティ設定を適切に行ってください。