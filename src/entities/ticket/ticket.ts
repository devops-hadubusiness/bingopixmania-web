// packages
import { z } from "zod";

// entities
import { User } from "../user/user";
import { Game } from "../game/game";
import { Winner } from "../winner/winner";

// types
export type TicketProps = {
  id: number;
  ref: string;
  userId: number;
  gameId: number;
  price: number;
  numbers: string[];
  createdAt: Date;

  // relationships
  user: User;
  game: Game;
  wins: Winner[];
};

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;

// schemas
export const createTicketSchema = z.object({
  userRef: z.string().uuid("Referência de usuário inválida."),
  gameRef: z.string().uuid("Referência de jogo inválida."),
});

export class Ticket {
  private props: TicketProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get userId() {
    return this.props.userId;
  }

  get gameId() {
    return this.props.gameId;
  }

  get price() {
    return this.props.price;
  }

  get numbers() {
    return this.props.numbers;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get user() {
    return this.props.user;
  }

  get game() {
    return this.props.game;
  }

  get wins() {
    return this.props.wins;
  }

  constructor(props: TicketProps) {
    this.props = props;
  }
}
