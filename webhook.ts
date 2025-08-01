/*
 * Google Calendar Watch Webhook
 *
 * この Supabase エッジ関数は、Google Calendar API の watch エンドポイントから通知を受け取り、
 * 対応する tasks テーブルのレコードを更新するためのフックとして利用できます。
 * 実際の実装では、`X-Goog-Channel-ID` や `X-Goog-Resource-ID` ヘッダーからイベント ID を取得し、
 * `gcal_event_id` カラムと照合して tasks レコードを更新してください。
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.15.1";

// Supabase client の初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  if (req.method === 'POST') {
    // Google からの通知ヘッダーをログに出力
    const channelId = req.headers.get('X-Goog-Channel-ID') || '';
    const resourceId = req.headers.get('X-Goog-Resource-ID') || '';
    const resourceState = req.headers.get('X-Goog-Resource-State') || '';
    console.log('Received Google Calendar webhook:', { channelId, resourceId, resourceState });

    // TODO: tasks テーブルの gcal_event_id と照合し、ステータスを更新する
    // 例:
    // await supabase.from('tasks')
    //   .update({ /* 更新内容 */ })
    //   .eq('gcal_event_id', resourceId);

    return new Response('ok', { status: 200 });
  }
  return new Response('Method Not Allowed', { status: 405 });
});