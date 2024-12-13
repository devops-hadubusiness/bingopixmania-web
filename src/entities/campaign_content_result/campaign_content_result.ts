// packages
import { z } from "zod";

export enum campaign_content_result_status {
  SENT = 'SENT',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export enum formatted_campaign_content_result_status {
  SENT = 'Enviada',
  PENDING = 'Pendente',
  FAILED = 'Falha',
}

export enum campaign_content_result_reason {
  NO_MEMBER = 'NO_MEMBER',
  OTHER = 'OTHER',
}

export enum formatted_campaign_content_result_reason {
  NO_MEMBER = 'Não possui WhatsApp',
  OTHER = 'Outro',
}

// entities
import { CampaignContents } from "../campaign_contents/campaign_contents";
import { CampaignResults } from "../campaign_results/campaign_results";


// types
export type CampaignContentResultProps = {
  campaignContentId: number
  campaignResultId: number
  status: campaign_content_result_status
  read?: boolean
  reason?: campaign_content_result_reason
  details?: string
  createdAt: Date
  updatedAt?: Date

  // relationships
  campaignContent: CampaignContents
  campaignResult: CampaignResults
};

// schemas
// export type GetCampaignContentResultByRefSchema = z.infer<typeof getCampaignContentResultByRefSchema>;

// export const getCampaignContentResultByRefSchema = z.object({
//   ref: z.string({ message: "Informe a referência." }),
//   companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
//   userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
// });

// class
export class CampaignContentResult {
  private props: CampaignContentResultProps;

  get campaignContentId() {
    return this.props.campaignContentId;
  }

  get campaignResultId() {
    return this.props.campaignResultId;
  }

  get status() {
    return this.props.status;
  }

  get read() {
    return this.props.read;
  }

  get reason() {
    return this.props.reason;
  }

  get details() {
    return this.props.details;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get campaignContent() {
    return this.props.campaignContent;
  }

  get campaignResult() {
    return this.props.campaignResult;
  }

  constructor(props: CampaignContentResultProps) {
    this.props = props;
  }
}
