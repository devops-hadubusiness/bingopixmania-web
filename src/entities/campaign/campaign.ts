// packages
import { z } from "zod";

// enums
export enum campaign_status {
  WAITING = "WAITING",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  DONE = "DONE",
  CANCELED = "CANCELED",
  DELETED = "DELETED",
}

export enum campaign_category {
  INDIVIDUAL = "INDIVIDUAL",
}

export enum formatted_campaign_status {
  WAITING = "Aguardando",
  RUNNING = "Em Execução",
  PAUSED = "Pausada",
  DONE = "Concluída",
  CANCELED = "Cancelada",
  DELETED = "Deletada",
}

export enum formatted_campaign_category {
  INDIVIDUAL = "Individual",
}

// entities
import { Company } from "../company/company";
import { User } from "../user/user";
import {
  CampaignContents,
  createCampaignContentsSchema,
} from "@/entities/campaign_contents/campaign_contents";
import { CampaignResults } from "@/entities/campaign_results/campaign_results";
import { createSessionContactsSchema } from "../contact/contact";

// types
export type CampaignProps = {
  id: number;
  ref: string;
  companyId: number;
  userId: number;
  name: string;
  category: campaign_category;
  status: campaign_status;
  delay: number[];
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  company?: Company;
  user?: User;
  contents?: CampaignContents[];
  results?: CampaignResults[];
};

// schemas
export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
export type GetCampaignByRefSchema = z.infer<typeof getCampaignByRefSchema>;
export type DeleteCampaignSchema = z.infer<typeof deleteCampaignSchema>;
export type UpdateCampaignSchema = z.infer<typeof updateCampaignSchema>;

export const createCampaignSchema = z.object({
  companyId: z.coerce
    .number({ message: "Informe a empresa." })
    .int({ message: "Empresa inválida." })
    .positive({ message: "Empresa inválida." }),
  userId: z.coerce
    .number({ message: "Informe o usuário." })
    .int({ message: "Usuário inválido." })
    .positive({ message: "Usuário inválido." }),
  name: z
    .string({ message: "Informe o nome." })
    .min(1, "Nome inválido.")
    .max(255, "Limite de caracteres: 255"),
  category: z.nativeEnum(campaign_category, {
    message: "Informe a categoria.",
  }),
  contents: z.array(createCampaignContentsSchema, {
    message: "Informe os conteúdos.",
  }),
  contacts: createSessionContactsSchema,
  shots: z
    .array(
      z.object({
        sessionId: z.coerce.number().int().positive(),
        shots: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Informe a quantidade de disparos."),
});

export const updateCampaignSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  status: z.nativeEnum(campaign_status, { message: "Informe o status." }),
});

export const getCampaignByRefSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce
    .number({ message: "Informe a empresa." })
    .int({ message: "Empresa inválida." })
    .positive({ message: "Empresa inválida." }),
  userId: z.coerce
    .number({ message: "Informe o usuário." })
    .int({ message: "Usuário inválido." })
    .positive({ message: "Usuário inválido." }),
});

export const deleteCampaignSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce
    .number({ message: "Informe a empresa." })
    .int({ message: "Empresa inválida." })
    .positive({ message: "Empresa inválida." }),
  userId: z.coerce
    .number({ message: "Informe o usuário." })
    .int({ message: "Usuário inválido." })
    .positive({ message: "Usuário inválido." }),
});

// class
export class Campaign {
  private props: CampaignProps;

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

  get category() {
    return this.props.category;
  }

  get type() {
    return this.props.type;
  }

  get status() {
    return this.props.status;
  }

  get delay() {
    return this.props.delay;
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

  get contents() {
    return this.props.contents;
  }

  get results() {
    return this.props.results;
  }

  constructor(props: CampaignProps) {
    this.props = props;
  }
}