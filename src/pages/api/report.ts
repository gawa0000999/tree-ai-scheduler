// API Route: /api/report
//
// このエンドポイントは完了したタスクの一覧を受け取り、
// OpenAI GPT を利用してその日の日報サマリーを生成して返します。
//
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// OpenAI のクライアントを初期化します
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tasks } = req.body as { tasks?: any[] };
  if (!tasks || !Array.isArray(tasks)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    // システムプロンプト: 簡潔な日本語の日報を生成するよう指示
    const systemPrompt = '以下のタスクの完了状況に基づき、1日の活動を簡潔に要約してください。箇条書きではなく、文章で書いてください。';
    const userContent = JSON.stringify(tasks);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    });
    const summary = completion.choices[0].message?.content || '';
    return res.status(200).json({ summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
}