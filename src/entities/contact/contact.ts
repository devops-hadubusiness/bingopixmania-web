// packages
import { z } from "zod";

// enums
export enum contact_status {
  PENDING = "PENDING",
  HAS_WHATSAPP = "HAS_WHATSAPP",
  NO_MEMBER = "NO_MEMBER",
  DELETED = "DELETED",
}

export enum formatted_contact_status {
  PENDING = "Pendente",
  HAS_WHATSAPP = "Possui WhatsApp",
  NO_MEMBER = "Não possui WhatsApp",
  DELETED = "Deletado",
}

// types
export type ContactTagProps = {
  name: string;
  color: string;
};

export type ContactVariableProps = {
  name: string;
  value: string | number;
};

// entities
import { Company } from "../company/company";
import { User } from "../user/user";
import { CampaignResults } from "@/entities/campaign_results/campaign_results";

// types
export type ContactProps = {
  id: number;
  ref: string;
  companyId: number;
  userId: number;
  name?: string;
  phone: string;
  profileName?: string;
  profilePicURL?: string;
  tags?: ContactTagProps[];
  variables?: ContactVariableProps[];
  status: contact_status;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  company?: Company;
  user?: User;
  results?: CampaignResults[];
};

// schemas
export type CreateContactSchema = z.infer<typeof createContactSchema>;
export type CreateContactsSchema = z.infer<typeof createContactsSchema>;
export type CreateSessionContactsSchema = z.infer<typeof createSessionContactsSchema>;
export type CreateContactTagSchema = z.infer<typeof createContactTagSchema>;
export type CreateContactVariableSchema = z.infer<typeof createContactVariableSchema>;
export type GetContactByRefSchema = z.infer<typeof getContactByRefSchema>;
export type DeleteContactSchema = z.infer<typeof deleteContactSchema>;
// export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

export const createContactTagSchema = z.object({
  name: z.string({ message: "Informe o nome da tag." }).min(1, "Nome da tag inválido.").max(50, "Limite de caracteres: 50"),
  color: z.string({ message: "Informe a cor da tag." }).min(1, "Cor da tag inválido.").max(7, "Limite de caracteres: 7"),
});

export const createContactVariableSchema = z
  .object({
    name: z.string({ message: "Informe o nome da variável." }),
    value: z.string({ message: "Informe o valor da variável." }).optional(),
    column: z.string({ message: "Informe o nome da coluna da variável." }).optional(),
  })
  .refine((data) => !!(data.value?.trim() || data.column?.trim()), { message: "Informe o valor da variável ou o nome da coluna da variável." });

export const createContactSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  name: z.string({ message: "Informe o nome." }).max(255, "Limite de caracteres: 255").optional(),
  phone: z.string({ message: "Informe o telefone." }).min(1, "Telefone inválido.").max(25, "Limite de caracteres: 25"),
  tags: z.array(createContactTagSchema).optional(),
  variables: z.array(createContactVariableSchema).optional(),
});

export const createContactsSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  contacts: z.array(
    z.object({
      name: z.string({ message: "Informe o nome." }).max(255, "Limite de caracteres: 255").optional(),
      phone: z.string({ message: "Informe o telefone." }).min(1, "Telefone inválido.").max(25, "Limite de caracteres: 25"),
      tags: z.array(createContactTagSchema).optional(),
      variables: z.array(createContactVariableSchema).optional(),
    })
  ),
});

export const createSessionContactsSchema = z.array(
  z.object({
    name: z.string({ message: "Informe o nome." }).max(255, "Limite de caracteres: 255").optional(),
    phone: z.string({ message: "Informe o telefone." }).min(1, "Telefone inválido.").max(25, "Limite de caracteres: 25"),
    tags: z.array(createContactTagSchema).optional(),
    variables: z.array(createContactVariableSchema).optional(),
  })
);

// export const updateContactSchema = z.object({
//   ref: z.string({ message: "Informe a referência." }),
//   ...createContactSchema.shape,
// });

export const getContactByRefSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

export const getUserContactsByStatusSchema = z.object({
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
  status: z.array(z.nativeEnum(contact_status, { message: "Informe o (s) status." })),
});

export const deleteContactSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

// class
export class Contact {
  private props: ContactProps;

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

  get profileName() {
    return this.props.profileName;
  }

  get profilePicURL() {
    return this.props.profilePicURL;
  }

  get tags() {
    return this.props.tags;
  }

  get variables() {
    return this.props.variables;
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

  get company() {
    return this.props.company;
  }

  get user() {
    return this.props.user;
  }

  get results() {
    return this.props.results;
  }

  constructor(props: ContactProps) {
    this.props = props;
  }
}
