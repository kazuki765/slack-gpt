import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export type ChatPrompt = {
  role: "user" | "system" | "assistant";
  content: string;
}[];
export async function askToGPT4(prompt: ChatPrompt) {
  return await openai
    .createChatCompletion({
      model: "gpt-4",
      messages: prompt,
      temperature: 0,
    })
    .then((res) => {
      return res.data.choices[0].message?.content ?? "";
    });
}
