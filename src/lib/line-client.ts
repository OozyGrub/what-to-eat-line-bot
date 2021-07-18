import { Client } from "@line/bot-sdk";

// Init LINE SDK
export const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});
