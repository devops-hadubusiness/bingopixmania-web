// packages
import { z } from 'zod'

// enums
export enum user_role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CUSTOMER = 'CUSTOMER'
}

export enum formatted_user_role {
  ADMIN = 'Admin',
  MODERATOR = 'Moderador',
  CUSTOMER = 'Cleinte'
}

export enum user_status {
  ALLOWED = 'ALLOWED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED'
}
export enum formatted_user_status {
  ALLOWED = 'Liberado',
  BLOCKED = 'Bloqueado',
  DELETED = 'Deletado'
}

// entities
import { CompanyUser } from '../company_user/company_user'
import { Session } from '../session/session'
import { Contact } from '../contact/contact'
import { Campaign } from '../campaign/campaign'

// types
export type UserProps = {
  id: number
  ref: string
  name: string
  email: string
  password: string
  role: user_role
  status: user_status
  createdAt: Date
  updatedAt?: Date

  // relationships
  companies?: CompanyUser[]
  sessions?: Session[]
  contacts?: Contact[]
  campaigns?: Campaign[]
}

export type LoginSchema = z.infer<typeof loginSchema>

// schemas
export const loginSchema = z.object({
  cpf: z.string({ message: 'Informe o cpf.' }).min(1, 'CPF inválido.').max(14, 'Limite de caracteres: 14.'),
  password: z.string({ message: 'Informe a senha.' }).min(1, 'Senha inválida.').max(255, 'Limite de caracteres: 255.')
})

export class User {
  private props: UserProps

  get id() {
    return this.props.id
  }

  get ref() {
    return this.props.ref
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get companies() {
    return this.props.companies
  }

  get sessions() {
    return this.props.sessions
  }

  get contacts() {
    return this.props.contacts
  }

  get campaigns() {
    return this.props.campaigns
  }

  constructor(props: UserProps) {
    this.props = props
  }
}
