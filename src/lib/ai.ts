/**
 * src/lib/ai.ts
 * ----------------------------------------
 * OpenAI Function Calling を使って
 * 文字列の TODO リストを構造化タスク配列に変換します。
 */

import { Configuration, OpenAIApi } from 'openai';

/* ---------- 型定義 ---------- */
export interface Task {
  title: string;
  duration_min: number;
  priority: number;
}

/* ---------- OpenAI クライアント ---------- */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // .env.local に設定
});
const openai = new OpenAIApi(configuration);

/* ---------- メイン関数 ---------- */
/**
 * @param input ユーザーが入力した TODO リスト文字列
 * @returns OpenAI が返す構造化タスク配列
 */
export async function splitTasks(input: string): Promise<Task[]> {
  // Function Calling 用 JSON Schema
  const functionSchema = {
    name: 'split_tasks',
    description: 'Break a todo list into executable tasks',
    parameters: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              duration_min: { type: 'integer' },
              priority: { type: 'integer' },
            },
            required: ['title', 'duration_min'],
          },
        },
      },
      required: ['tasks'],
    },
  };

  // Chat Completion
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // 必要に応じて変更
    messages: [{ role: 'user', content: input }],
    functions: [functionSchema],
    function_call: { name: 'split_tasks' },
  });

  // 引数をパース
  const raw = completion.choices[0].message?.function_call?.arguments ?? '{}';

  try {
    const parsed = JSON.parse(raw) as { tasks?: Task[] };
    return Array.isArray(parsed.tasks) ? parsed.tasks : [];
  } catch {
    // パース失敗時は空配列を返す
    return [];
  }
}
