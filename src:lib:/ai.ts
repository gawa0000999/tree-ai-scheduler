/*
 * ai.ts
 *
 * OpenAI GPT-4o（function calling）を利用して、ユーザーが入力した todo リストを実行可能な
 * タスクへ分解するためのユーティリティ関数群です。Next.js の API Routes から呼び出すことを想定しています。
 */

import { OpenAIApi, Configuration } from 'openai'

// OpenAI API の初期化
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Task 型（仮定）
export interface Task {
  title: string
  duration_min: number
  priority: number
}

// JSON Schema 定義: todo リストを分解したタスクの形式
const tasksSplitFn = {
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
  },
}

// 修正対象の関数：型指定ありに変更済み
export async function splitTasks(input: string): Promise<Task[]> {
  // 仮のダミーデータ（OpenAI呼び出しロジックは未実装）
  return [
    {
      title: 'Write spec document',
      duration_min: 60,
      priority: 1,
    },
    {
      title: 'Team review meeting',
      duration_min: 30,
      priority: 2,
    },
  ]
}
