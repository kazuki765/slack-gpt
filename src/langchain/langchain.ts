import axios from "axios";
import { getHost, isValidUrl } from "../utils/url";
import { convert } from "html-to-text";
import { getSummaryFromText } from "../openai/openai";

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

    const summary = await getSummaryFromText(text);
    console.log(summary);

    return summary;
  }
  throw new Error("content is not html");
}

function parseHtmlToText(html: string) {
  return convert(html);
}
