import { COMMAND } from "./types/enums";
import { get } from "lodash";
import { app } from ".";
import { lineClient } from "./lib/line-client";
import { foodService } from "./services/food.service";
import { messageService } from "./services/message.service";

app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  await lineClient.broadcast({ type: "text", text: JSON.stringify(message) });

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

      default:
        res.sendStatus(200);
    }
  } catch (e) {
    console.error(e);
    await lineClient.broadcast({ type: "text", text: JSON.stringify(e) });
    return res.sendStatus(400).send(e);
  }

  return res.sendStatus(200);
});
