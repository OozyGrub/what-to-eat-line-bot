import { FoodParams } from "./types/food.d";
import { Client } from "@line/bot-sdk";
import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import { get } from "lodash";
import moment from "moment-timezone";
import { foodService } from "./services/food.service";
import { messageService } from "./services/message.service";

// Init Express
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

// Init LINE SDK
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

moment.locale("th");
moment.tz.setDefault("Asia/Bangkok");

// Webhook
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  if (message === "กินไร") {
    try {
      const menu = await foodService.getRandomMenu();
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
    const menu = await foodService.getRandomMenu();
    const message = messageService.getBubble(menu);

    // await lineClient.pushMessage(process.env.GROUP_ID, message);

    await lineClient.broadcast({
      type: "text",
      text: menu.join(" "),
    });

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

app.get("/food", async (req, res) => {
  const excludeRecent = (req.query?.excludeRecent as string) === "true";

  const foods = await foodService.findAll({ excludeRecent });

  return res.send({ length: foods.map((food) => food._rawJson) });
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
