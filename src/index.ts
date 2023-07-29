import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
import { generateMention } from "./utils/slack.util";
import { getSummary } from "./langchain/langchain";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: Number(process.env.APP_LISTEN_PORT || 3000),
});

app.event("app_mention", async ({ event, say }) => {
  await say(`Hey there <@${event.user}>!`);
});

app.command("/gpt", async ({ command, ack, say }) => {
  await ack();
  await say(`Hello ${generateMention(command.user_id)}!`);
});

app.command("/summary", async ({ command, ack, say, respond }) => {
  await ack();

  const url = command.text.trim();

  try {
    const result = await say(
      generateMention(command.user_id) + " 要約中...\n" + url
    );
    const summary = await getSummary(url);

    await say({
      text: summary ?? "要約できませんでした",
      thread_ts: result.ts,
    });
  } catch (e) {
    console.error(e);
    await say("要約できませんでした");
  }
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
