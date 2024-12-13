// packages
import { z } from "zod";

// enums
export enum campaign_content_type {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  IMAGE_TEXT = "IMAGE_TEXT",
  VIDEO = "VIDEO",
  VIDEO_TEXT = "VIDEO_TEXT",
  DOCUMENT = "DOCUMENT",
  DOCUMENT_TEXT = "DOCUMENT_TEXT",
  AUDIO = "AUDIO",
  AUDIO_TEXT = "AUDIO_TEXT",
}

export enum formatted_campaign_content_type {
  TEXT = "Texto",
  IMAGE = "Imagem",
  IMAGE_TEXT = "Imagem e Texto",
  VIDEO = "Vídeo",
  VIDEO_TEXT = "Vídeo e Texto",
  DOCUMENT = "Documento",
  DOCUMENT_TEXT = "Documento e Texto",
  AUDIO = "Áudio",
  AUDIO_TEXT = "Áudio e Texto",
}

export enum campaign_content_extension {
  text = "text",
  jpg = "jpg",
  jpeg = "jpeg",
  png = "png",
  doc = "doc",
  pdf = "pdf",
  xls = "xls",
  csv = "csv",
  xlsx = "xlsx",
  excel = "excel",
  office = "office",
  audio = "audio",
  mp4 = "mp4",
  mp3 = "mp3",
  ogg = "ogg",
}

// entities
import { Campaign } from "../campaign/campaign";
import { CampaignContentResult } from "../campaign_content_result/campaign_content_result";

// types
export type CampaignContentsProps = {
  id: number;
  ref: string;
  campaignId: number;
  type: campaign_content_type;
  extension: campaign_content_extension;
  content?: string;
  path?: string;
  delay: number[];
  useRandomHash: boolean;
  index: number;

  // relationships
  campaign: Campaign;
  results?: CampaignContentResult[];
};

// schemas
export type CreateCampaignContentsSchema = z.infer<typeof createCampaignContentsSchema>;
export type GetCampaignContentsByRefSchema = z.infer<typeof getCampaignContentsByRefSchema>;

export const createCampaignContentsSchema = z.object({
  index: z.coerce.number({ message: "Informe o index." }).int({ message: "Index inválido." }).positive({ message: "Index inválido." }),
  type: z.nativeEnum(campaign_content_type, { message: "Informe o tipo." }),
  extension: z.nativeEnum(campaign_content_extension, {
    message: "Informe a extensão.",
  }),
  content: z.string({ message: "Informe o conteúdo." }).optional(),
  file: z
    .object({
      name: z.string(),
      extension: z.string(),
      base64: z.string(),
      // folderName: z.string()
    })
    .optional(),
  delay: z
    .array(z.coerce.number().min(30, { message: "O valor mínimo para o delay é 30 segundos." }))
    .min(2, { message: "O delay deve conter dois valores: mínimo e máximo." })
    .max(2, {
      message: "O delay deve conter apenas dois valores: mínimo e máximo.",
    }),
  useRandomHash: z.boolean({ message: "Hash randômico inválido." }),
});

export const getCampaignContentsByRefSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

// class
export class CampaignContents {
  private props: CampaignContentsProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get campaignId() {
    return this.props.campaignId;
  }

  get type() {
    return this.props.type;
  }

  get extension() {
    return this.props.extension;
  }

  get content() {
    return this.props.content;
  }

  get path() {
    return this.props.path;
  }

  get delay() {
    return this.props.delay;
  }

  get useRandomHash() {
    return this.props.useRandomHash;
  }

  get index() {
    return this.props.index;
  }

  get campaign() {
    return this.props.campaign;
  }

  get results() {
    return this.props.results;
  }

  constructor(props: CampaignContentsProps) {
    this.props = props;
  }
}
