// packages
import { z } from "zod";

// entities
import { User } from "../user/user";

// enums
export enum deposit_status {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID'
}

export enum formatted_deposit_status {
  PENDING = 'Pendente',
  EXPIRED = 'Expirado',
  PAID = 'Pago'
}

// types
export type DepositProps = {
  id: number;
  ref: string;
  userId: number;
  value: number;
  bonusValue: number;
  gatewayRef: string;
  gatewayQrCode: string;
  gatewayQrCodeB64: string;
  status: deposit_status;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  user: User;
};

export type CreateDepositSchema = z.infer<typeof createDepositSchema>;

// schemas
export const createDepositSchema = z.object({
  userRef: z.string().uuid("Referência de usuário inválida."),
  value: z.number().min(0, "Valor de depósito inválido."),
  bonusValue: z.number().min(0, "Valor de bônus inválido.").optional(),
});

export class Deposit {
  private props: DepositProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get userId() {
    return this.props.userId;
  }

  get value() {
    return this.props.value;
  }

  get bonusValue() {
    return this.props.bonusValue;
  }

  get gatewayRef() {
    return this.props.gatewayRef;
  }

  get gatewayQrCode() {
    return this.props.gatewayQrCode;
  }

  get gatewayQrCodeB64() {
    return this.props.gatewayQrCodeB64;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get user() {
    return this.props.user;
  }

  constructor(props: DepositProps) {
    this.props = props;
  }
}
