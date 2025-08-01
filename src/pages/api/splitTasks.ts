// API Route: /api/splitTasks
//
// このエンドポイントはフロントエンドから受け取った todo リスト文字列を
// OpenAI 関数呼び出しを通じて Task 配列に変換して返します。

import type { NextApiRequest, NextApiResponse } from 'next';
import { splitTasks, Task } from '../../lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { input } = req.body as { input?: string };
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const tasks: Task[] = await splitTasks(input);
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to split tasks' });
  }
}