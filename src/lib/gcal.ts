/*
 * gcal.ts
 *
 * Google Calendar API を利用して、タスクをカレンダーイベントとして登録するユーティリティ関数です。
 * OAuth2 トークンは Next.js の API Routes などでユーザー認証後に取得したものを渡してください。
 */

import { google } from 'googleapis';

export interface GoogleAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface TaskEvent {
  title: string;
  duration_min: number;
  start?: Date;
  priority?: number;
  deadline?: Date;
}

/**
 * 指定した時間帯に空きがあるか計算し、タスクの時間枠を返す簡易的なロジック。
 * 本番環境ではユーザーのカレンダーを読み込み、優先度や期限を考慮して適切なスロットを計算します。
 * @param durationMin タスクの所要時間（分）
 */
export function findSlot(durationMin: number): Date {
  // とりあえず現在時刻の 5 分後を開始時間とする
  const now = new Date();
  return new Date(now.getTime() + 5 * 60 * 1000);
}

/**
 * minutes だけ加算して新しい Date を返すユーティリティ。
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * タスクを Google Calendar にイベントとして挿入します。
 * @param tokens Google OAuth2 トークン
 * @param tasks タスクの一覧
 */
export async function insertEvents(tokens: GoogleAuthTokens, tasks: TaskEvent[]) {
  const { OAuth2 } = google.auth;
  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials(tokens);

  const cal = google.calendar({ version: 'v3', auth: oauth2Client });
  for (const t of tasks) {
    const start = t.start ?? findSlot(t.duration_min);
    const end = addMinutes(start, t.duration_min);
    await cal.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: t.title,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
  }
}