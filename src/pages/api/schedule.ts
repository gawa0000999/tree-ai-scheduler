// API Route: /api/schedule
//
// このエンドポイントは OpenAI により生成されたタスクを受け取り、
// Google Calendar API を介してユーザーのカレンダーへイベントとして登録します。
// OAuth トークンはフロントエンドで取得したものをリクエストボディに含めてください。

import type { NextApiRequest, NextApiResponse } from 'next';
import { insertEvents, TaskEvent, GoogleAuthTokens } from '../../lib/gcal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tokens, tasks } = req.body as { tokens?: GoogleAuthTokens; tasks?: TaskEvent[] };
  if (!tokens || !tasks || !Array.isArray(tasks)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    await insertEvents(tokens, tasks);
    return res.status(200).json({ message: 'Events inserted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to insert events' });
  }
}