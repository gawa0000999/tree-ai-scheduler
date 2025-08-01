/*
 * ai.ts
 *
 * OpenAI GPT-4o (function calling) を利用して、ユーザーが入力した todo リストを実行可能な
 * タスクへ分解するためのユーティリティ関数です。Next.js の API Routes から呼び出すことを想定しています。
 */

import { OpenAIApi, Configuration } from 'openai';

// OpenAI API の初期化
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// JSON Schema 定義: todo リストを分解したタスクの形式
const taskSplitFn = {
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
} as const;

export interface Task {
  title: string;
  duration_min: number;
  priority?: number;
  deadline?: string;
}

/**
 * ユーザーの入力文字列を OpenAI API に送り、タスクを分解して返します。
 * @param input Text area に入力された todo リスト
 */
export async function splitTasks(input: string): Promise<Task[]> {
  const res = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: input },
    ],
    functions: [taskSplitFn],
    function_call: { name: 'split_tasks' },
  });

  const choice = res.data.choices?.[0];
  if (!choice || choice.finish_reason !== 'function_call') {
    throw new Error('OpenAI did not return a function call');
  }

  const args = JSON.parse(choice.message?.function_call?.arguments ?? '{}') as { tasks: Task[] };
  return args.tasks;
}