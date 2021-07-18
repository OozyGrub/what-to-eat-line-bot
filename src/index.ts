import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import moment from "moment-timezone";
import { lineClient } from "./lib/line-client";
import { foodService } from "./services/food.service";
import { messageService } from "./services/message.service";

// Init Express
export const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

moment.locale("th");
moment.tz.setDefault("Asia/Bangkok");

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.post("/what-to-eat", async (req, res) => {
  try {
    const menu = await foodService.getRandomMenu();
    const message = messageService.buildFoodMenuMsg(menu);

    // await lineClient.pushMessage(process.env.GROUP_ID, message);

    await lineClient.broadcast(message);

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
