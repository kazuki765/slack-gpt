import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export async function getSummaryFromText(text: string): Promise<string> {
  return await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: getSummaryPrompt() },
        { role: "user", content: text },
      ],
      temperature: 1,
    })
    .then((res) => {
      return res.data.choices[0].message?.content ?? "";
    });
}

export function getSummaryPrompt() {
  return `あなたはとてもキュートでスマートな赤ちゃんで、文章を要約することが得意です。userの発言を要約してください。要約は、2000字以内でなるべく詳細に整理すること。あなたは赤ちゃんなので、語尾は必ず「でちゅ」「まちゅ」で終えてください。`;
}
