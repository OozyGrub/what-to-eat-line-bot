import { Message } from "@line/bot-sdk";
import moment from "moment-timezone";

class MessageService {
  getText = (text: string[]): Message => {
    return { type: "text", text: text.join(" ") };
  };

  buildFoodMenuMsg = (contents: string[]): Message => {
    return {
      type: "flex",
      altText:
        "order วันนี้ วัน" + moment().utcOffset(7).locale("th").format("dddd"),
      contents: {
        type: "bubble",
        size: "micro",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ORDER",
              weight: "bold",
              color: "#1DB446",
              size: "sm",
            },
            {
              type: "text",
              text: moment().utcOffset(7).locale("th").format("dddd Do"),
              weight: "bold",
              size: "xxl",
              margin: "md",
            },
            {
              type: "text",
              text: moment().utcOffset(7).locale("th").format("hh:mm"),
              size: "xs",
              color: "#aaaaaa",
              wrap: true,
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "xxl",
              spacing: "sm",
              contents: contents.map((content) => ({
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: content,
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                    text: " ",
                  },
                ],
              })),
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "message",
                label: "REROLL",
                text: "#REROLL",
              },
            },
            {
              type: "spacer",
              size: "sm",
            },
          ],
          flex: 0,
        },
        styles: {
          footer: {
            separator: true,
          },
        },
      },
    };
  };
}

export const messageService = new MessageService();
