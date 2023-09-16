import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
import { generateMention } from "./utils/slack.util";
import { getSummary } from "./langchain/langchain";
import { ChatPrompt, askToGPT4 } from "./openai/openai";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: Number(process.env.APP_LISTEN_PORT || 3000),
});

const THINKING_MESSAGE = "考え中...";
app.event("app_mention", async ({ event, say, client, body }) => {
  await say({
    text: THINKING_MESSAGE,
    thread_ts: event.ts,
  });

  try {
    // NOTE: これまでの会話履歴を取得する
    const result = await client.conversations.replies({
      channel: event.channel,
      ts: event.thread_ts ?? event.ts,
    });
    console.log("apiResult: ", result);

    const prompts: ChatPrompt =
      result.messages
        ?.filter((m) => m.text !== THINKING_MESSAGE)
        .map((m) => ({
          role: m.user === event.user ? "user" : "assistant",
          content: m.text ?? "",
        })) ?? [];
    console.log("prompts: ", prompts);

    if (!prompts || prompts.length === 0) {
      throw new Error("no conversations");
    }

    const response = await askToGPT4(prompts);

    await say({
      text: response,
      thread_ts: event.ts,
    });
  } catch (e) {
    console.error(e);
    await say({
      text: "予期せぬエラーが発生しました",
      thread_ts: event.ts,
    });
  }
});

app.command("/summary", async ({ command, ack, say }) => {
  await ack();

  const url = command.text.trim();

  const result = await say(
    generateMention(command.user_id) + " 要約中...\n" + url
  );

  try {
    const summary = await getSummary(url);

    await say({
      text: summary ?? "要約できませんでした",
      thread_ts: result.ts,
    });
  } catch (e) {
    console.error(e);
    await say(getError(result));
  }
});

function getError(errorResult: any) {
  return {
    text: "要約できませんでした",
    thread_ts: errorResult.ts,
  };
}

(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

// TODO: スレッド上でサマリとチャットのプロンプトを分離する方法を考える
//   blocks: [
//     {
//       type: "divider",
//     },
//     {
//       type: "input",
//       element: {
//         type: "radio_buttons",
//         options: [
//           {
//             text: {
//               type: "plain_text",
//               text: "要約",
//               emoji: true,
//             },
//             value: "summary",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "チャット",
//               emoji: true,
//             },
//             value: "chat",
//           },
//         ],
//         action_id: "radio_buttons-action",
//       },
//       label: {
//         type: "plain_text",
//         text: "Label",
//         emoji: true,
//       },
//     },
//     {
//       type: "input",
//       element: {
//         type: "plain_text_input",
//         multiline: true,
//         action_id: "plain_text_input-action",
//       },
//       label: {
//         type: "plain_text",
//         text: "文章を入力してね！",
//       },
//       dispatch_action: true,
//     },
//     {
//       type: "divider",
//     },
//   ],
//   thread_ts: event.ts,
// });

// console.log(re);
