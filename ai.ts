import { OpenAIApi, Configuration } from 'openai'

// Task型定義（スキーマから生成されるのが理想）
export interface Task {
  title: string
  duration_min: number
  priority: number
}

// OpenAI API 初期化
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

/**
 * OpenAI Function Calling を用いて、入力文字列から実行可能タスク群へ分解する
 */
export async function splitTasks(input: string): Promise<Task[]> {
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
    },
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'user',
        content: input,
      },
    ],
    functions: [functionSchema],
    function_call: { name: 'split_tasks' },
  })

  const args = JSON.parse(res.choices[0].message.function_call?.arguments ?? '{}')
  return args.tasks ?? []
}
