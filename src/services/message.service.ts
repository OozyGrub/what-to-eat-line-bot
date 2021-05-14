import { Message } from "@line/bot-sdk";

export class MessageService {
  getText = (text: string): Message => {
    return { type: "text", text };
  };
}
