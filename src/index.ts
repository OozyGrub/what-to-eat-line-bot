import { Client } from "@line/bot-sdk";
import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import { get } from "lodash";
import { FoodService } from "./services/food.service";
import { MessageService } from "./services/message.service";

// Init Express
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

// Init LINE SDK
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

const foodService = new FoodService();
const messageService = new MessageService();

// Webhook
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const eventType = get(event, ["message", "type"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  if (message === "กินไร") {
    try {
      const menu = await foodService.randomMenu();
      const message = messageService.getBubble(menu);
      await lineClient.replyMessage(replyToken, message);
    } catch (e) {
      console.error(e);
      await lineClient.broadcast({
        type: "text",
        text: "ERROR",
      });
      return res.sendStatus(400).send(e);
    }
  }
  return res.sendStatus(200);
});

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.post("/what-to-eat", async (req, res) => {
  try {
    const menu = await foodService.randomMenu();
    const message = messageService.getBubble(menu);
    await lineClient.pushMessage(process.env.GROUP_ID, message);
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    await lineClient.broadcast({
      type: "text",
      text: "ERROR",
    });
    return res.sendStatus(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
