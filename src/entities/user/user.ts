// packages
import { z } from "zod";

// entities
import { Game } from "../game/game";
import { Ticket } from "../ticket/ticket";
import { Winner } from "../winner/winner";
import { Deposit } from "../deposit/deposit";
import { Withdrawal } from "../withdrawal/withdrawal";

// enums
export enum user_role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER",
}

export enum formatted_user_role {
  ADMIN = "Administrador",
  MODERATOR = "Moderador",
  CUSTOMER = "Cliente",
}

export enum user_status {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum formatted_user_status {
  ALLOWED = "Permitido",
  BLOCKED = "Bloqueado",
  DELETED = "Deletado",
}

export enum user_affiliation_status {
  REGISTERED = "REGISTERED",
  FINISHED = "FINISHED",
}

export enum formatted_user_affiliation_status {
  REGISTERED = "Registrado",
  FINISHED = "Finalizado",
}

// types
export type UserProps = {
  id: number;
  ref: string;
  userId?: number;
  name: string;
  cpf: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: Date | string;
  balance: number;
  src?: string;
  ip: string;
  role: user_role;
  status: user_status;
  affiliationStatus?: user_affiliation_status;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  parent?: User;
  affiliateds: User[];
  games: Game[];
  tickets: Ticket[];
  wins: Winner[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
};

export type LoginSchema = z.infer<typeof loginSchema>;

// schemas
export const loginSchema = z.object({
  cpf: z
    .string()
    .min(1, "CPF inválido.")
    .max(14, "Limite de caracteres: 14.")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: "Formato inválido de CPF.",
    }),
  password: z.string({ message: "Informe a senha." }).min(1, "Senha inválida.").max(255, "Limite de caracteres: 255."),
});

export class User {
  private props: UserProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get balance() {
    return this.props.balance;
  }

  get src() {
    return this.props.src;
  }

  get ip() {
    return this.props.ip;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get affiliationStatus() {
    return this.props.affiliationStatus;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get parent() {
    return this.props.parent;
  }

  get affiliateds() {
    return this.props.affiliateds;
  }

  get games() {
    return this.props.games;
  }

  get tickets() {
    return this.props.tickets;
  }

  get wins() {
    return this.props.wins;
  }

  get deposits() {
    return this.props.deposits;
  }

  get withdrawals() {
    return this.props.withdrawals;
  }

  constructor(props: UserProps) {
    this.props = props;
  }
}
