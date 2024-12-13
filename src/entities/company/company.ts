// packages
import { z } from "zod";

// enums
export enum company_status {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export enum formatted_company_status {
  ACTIVE = "Ativo",
  DELETED = "Deletado",
}

// entities
import { CompanyUser } from "../company_user/company_user";
import { Session } from "../session/session";
import { Contact } from "../contact/contact";
import { Campaign } from "../campaign/campaign";

// types
export type CompanyProps = {
  id: number;
  ref: string;
  name: string;
  email?: string;
  status: company_status;
  createdAt: Date;
  updatedAt?: Date;

  // relationships
  users?: CompanyUser[];
  sessions?: Session[];
  contacts?: Contact[];
  campaigns?: Campaign[];
};

export type CompanyStore = {
  id: number;
  ref: string;
  name: string;
};

// schemas
export type CreateCompanySchema = z.infer<typeof createCompanySchema>;
export type GetCompanyByRefSchema = z.infer<typeof getCompanyByRefSchema>;
export type DeleteCompanySchema = z.infer<typeof deleteCompanySchema>;
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;

export const createCompanySchema = z.object({
  name: z.string({ message: "Informe o nome." }).min(1, "Nome inválido.").max(150, "Limite de caracteres: 150"),
  email: z.string({ message: "Informe o email." }).min(1, "Email inválido.").max(100, "Limite de caracteres: 100"),
});

export const updateCompanySchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  status: z.nativeEnum(company_status, { message: "Informe o status." }),
  ...createCompanySchema.shape,
});

export const getCompanyByRefSchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

export const deleteCompanySchema = z.object({
  ref: z.string({ message: "Informe a referência." }),
  companyId: z.coerce.number({ message: "Informe a empresa." }).int({ message: "Empresa inválida." }).positive({ message: "Empresa inválida." }),
  userId: z.coerce.number({ message: "Informe o usuário." }).int({ message: "Usuário inválido." }).positive({ message: "Usuário inválido." }),
});

// class
export class Company {
  private props: CompanyProps;

  get id() {
    return this.props.id;
  }

  get ref() {
    return this.props.ref;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
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

  get users() {
    return this.props.users;
  }

  get sessions() {
    return this.props.sessions;
  }

  get contacts() {
    return this.props.contacts;
  }

  get campaigns() {
    return this.props.campaigns;
  }

  constructor(props: CompanyProps) {
    this.props = props;
  }
}
