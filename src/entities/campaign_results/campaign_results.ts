// packages
import { z } from 'zod'

// enums
export enum campaign_result_status {
  DONE = 'DONE',
  PENDING = 'PENDING',
  SENDING = 'SENDING'
}

export enum formatted_campaign_result_status {
  DONE = 'Concluído',
  PENDING = 'Pendente',
  SENDING = 'Enviando'
}

// entities
import { Session } from '../session/session'
import { Campaign } from '../campaign/campaign'
import { Contact } from '../contact/contact'
import { CampaignContentResult } from "../campaign_content_result/campaign_content_result";

// types
export type CampaignResultsProps = {
  id: number;
  ref: string;
  sessionId: number;
  campaignId: number;
  contactId: number;
  status: campaign_result_status;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  session: Session;
  campaign: Campaign;
  contact: Contact;
  contents?: CampaignContentResult[];
}

// schemas
export type GetCampaignResultsByRefSchema = z.infer<typeof getCampaignResultsByRefSchema>

export const getCampaignResultsByRefSchema = z.object({
  ref: z.string({ message: 'Informe a referência.' }),
  companyId: z.coerce.number({ message: 'Informe a empresa.' }).int({ message: 'Empresa inválida.' }).positive({ message: 'Empresa inválida.' }),
  userId: z.coerce.number({ message: 'Informe o usuário.' }).int({ message: 'Usuário inválido.' }).positive({ message: 'Usuário inválido.' })
})

// class
export class CampaignResults {
  private props: CampaignResultsProps

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get sessionId() {
    return this.props.sessionId;
  }

  get campaignId() {
    return this.props.campaignId;
  }

  get contactId() {
    return this.props.contactId;
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

  get session() {
    return this.props.session;
  }

  get campaign() {
    return this.props.campaign;
  }

  get contact() {
    return this.props.contact;
  }

  get contents() {
    return this.props.contents;
  }

  constructor(props: CampaignResultsProps) {
    this.props = props
  }
}
