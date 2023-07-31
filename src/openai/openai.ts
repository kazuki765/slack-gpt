import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

// const SUMMARIZE_PROMPT = `

// `;

export async function getSummaryFromText(text: string): Promise<string> {
  console.log(text);
  return await openai
    // .createCompletion({
    //   model: "text-davinci-003",
    //   prompt: getSummarizePrompt(text),
    //   temperature: 0,
    //   max_tokens: 4096,
    // })
    .createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: getSummarizePrompt() },
        { role: "user", content: `article: ${text}` },
      ],
      temperature: 0,
    })
    .then((res) => {
      return res.data.choices[0].message?.content ?? "";
    });
}

function getSummarizePrompt() {
  return `
  You are an excellent summarizer.
  Follow the steps below to summarize user-submitted articles in Japanese.
  Step1: Extract the conclusion of the article
  Step2: Extract the article's main points
  Step3: Describe the rationale for each of the points you extracted in Step 2
  Step4: Summarize the sentences from Steps 1~3 into 5 lines.
  
  Write in Japanese!!!`;
}
