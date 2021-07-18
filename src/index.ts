import { get } from "lodash";
import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import moment from "moment-timezone";
import { lineClient } from "./lib/line-client";
import { foodService } from "./services/food.service";
import { messageService } from "./services/message.service";
import { COMMAND } from "./types/enums";

moment.locale("th");
moment.tz.setDefault("Asia/Bangkok");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/what-to-eat", async (req, res) => {
  try {
    const menu = await foodService.getRandomMenu();
    const message = messageService.buildFoodMenuMsg(menu);
    await lineClient.pushMessage(process.env.GROUP_ID, message);

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    await lineClient.broadcast({ type: "text", text: "ERROR" });
    return res.sendStatus(400).send(e);
  }
});

app.get("/food", async (req, res) => {
  const excludeRecent = (req.query?.excludeRecent as string) === "true";
  const foods = await foodService.findAll({ excludeRecent });
  return res.send({ length: foods.map((food) => food._rawJson) });
});

app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  try {
    switch (message) {
      case COMMAND.WHAT_TO_EAT: {
        const menu = await foodService.getRandomMenu();
        const message = messageService.buildFoodMenuMsg(menu);
        await lineClient.replyMessage(replyToken, message);
      }

      case COMMAND.REROLL: {
        const menu = await foodService.getRerolledRandomMenu();
        const message = messageService.buildFoodMenuMsg(menu);
        await lineClient.replyMessage(replyToken, message);
      }
    }
  } catch (e) {
    console.error(e);
    await lineClient.broadcast({ type: "text", text: JSON.stringify(e) });
    return res.sendStatus(400).send(e);
  }

  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
