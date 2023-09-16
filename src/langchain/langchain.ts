import axios from "axios";
import { getHost, isValidUrl } from "../utils/url";
import { convert } from "html-to-text";
import { askToGPT4 } from "../openai/openai";

export async function getSummary(url: string) {
  if (!isValidUrl(url)) {
    return;
  }
  if (getHost(url) === "www.youtube.com") {
    // TODO: youtube summary
    return "youtube summarizer coming soon";
  } else {
    return await getWebpageSummary(url);
  }
}

async function getWebpageSummary(url: string): Promise<string> {
  const result = await axios.get<string>(url);

  if (typeof result.data === "string") {
    const text = parseHtmlToText(result.data);

    const summary = await askToGPT4([
      { role: "system", content: getSummarizePrompt() },
      { role: "user", content: `article: ${text}` },
    ]);
    console.log(summary);

    return summary;
  }
  throw new Error("content is not html");
}

function parseHtmlToText(html: string) {
  return convert(html);
}

export function getSummarizePrompt() {
  return `
  You are an excellent summarizer.
  Follow the steps below to summarize user-submitted articles in Japanese.
  Step1: Extract the conclusion of the article
  Step2: Extract the article's main points
  Step3: Describe the rationale for each of the points you extracted in Step 2
  Step4: Summarize the sentences from Steps 1~3 into 5 lines.

  Write in Japanese!!!`;
}
