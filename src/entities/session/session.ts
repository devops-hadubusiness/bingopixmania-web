// packages
import { z } from "zod";

// enums
export enum session_status {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BUSY = "BUSY",
  PAUSED = "PAUSED",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum formatted_session_status {
  PENDING = "Pendente",
  ACTIVE = "Ativa",
  BUSY = "Em Uso",
  PAUSED = "Pausada",
  INACTIVE = "Inativa",
  BLOCKED = "Bloqueada",
  DELETED = "Deletada",
}

// entities
import { Company } from "../company/company";
import { User } from "../user/user";
import { CampaignResults } from "../campaign_results/campaign_results";

// types
export type SessionProps = {
  id: number;
  ref: string;
  companyId: number;
  userId: number;
  name: string;
  phone: string;
  status: session_status;
  profileName?: string;
  profilePicURL?: string;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  company?: Company;
  user?: User;
  results?: CampaignResults[];
};

// schemas
export type CreateSessionSchema = z.infer<typeof createSessionSchema>;
export type GetSessionByRefSchema = z.infer<typeof getSessionByRefSchema>;
export type GetUserSessionsByStatusSchema = z.infer<typeof getUserSessionsByStatusSchema>;
export type DeleteSessionSchema = z.infer<typeof deleteSessionSchema>;
export type UpdateSessionSchema = z.infer<typeof updateSessionSchema>;

export const createSessionSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  ref: z.string({ message: "Informe a referência." }).optional(),
  name: z.string({ message: "Informe o nome." }).max(255, "Limite de caracteres: 255").optional(),
  qrCodeTimeout: z.coerce.number({ message: "Informe a duração do qr code." }).min(30, { message: "Min: 30." }).max(300, { message: "Máx: 300." }),
});

export const updateSessionSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  ref: z.string({ message: "Informe a referência." }),
  name: z.string({ message: "Informe o nome." }).max(255, "Limite de caracteres: 255").optional(),
  status: z.nativeEnum(session_status, { message: "Informe o status." }),
});

export const getSessionByRefSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

export const getUserSessionsByStatusSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  status: z.array(z.nativeEnum(session_status, { message: "Informe o (s) status." })),
});

export const deleteSessionSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

// class
export class Session {
  private props: SessionProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get companyId() {
    return this.props.companyId;
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get phone() {
    return this.props.phone;
  }

  get status() {
    return this.props.status;
  }

  get profileName() {
    return this.props.profileName;
  }

  get profilePicURL() {
    return this.props.profilePicURL;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get company() {
    return this.props.company;
  }

  get user() {
    return this.props.user;
  }

  get results() {
    return this.props.results;
  }

  constructor(props: SessionProps) {
    this.props = props;
  }
}
