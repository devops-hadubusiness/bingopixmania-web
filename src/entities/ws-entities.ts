// entities
import { CreateSessionSchema } from "./session/session";

// types
export type TWebSocketMessageBodyProps = {
  action: "createSession";
  authorization: string;
};

export type TWebSocketMessage = {
  action: "sendMessage";
  body: TWebSocketMessageBodyProps & CreateSessionSchema;
};
