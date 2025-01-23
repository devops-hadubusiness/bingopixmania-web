// packages
import { z } from 'zod'

// entities
import { privateRouteSchema } from '@/entities/route-entities'
import { User } from '../user/user'

// enums
export enum withdrawal_pix_type {
  CPF = 'CPF',
  PHONE = 'PHONE'
}

export enum formatted_withdrawal_pix_type {
  CPF = 'CPF',
  PHONE = 'Telefone'
}

export enum withdrawal_status {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DONE = 'DONE'
}

export enum formatted_withdrawal_status {
  PENDING = 'Pendente',
  REJECTED = 'Rejeitado',
  DONE = 'Concluído'
}

// types
export type WithdrawalProps = {
  id: number
  ref: string
  userId: number
  value: number
  pixType: withdrawal_pix_type
  pixKey: string
  status: withdrawal_status
  reason?: string
  createdAt: Date
  updatedAt?: Date

  // relationships
  user: User
}

export type CreateWithdrawalSchema = z.infer<typeof createWithdrawalSchema>

// schemas
export const createWithdrawalSchema = privateRouteSchema.extend({
  userRef: z.string().uuid('Referência de usuário inválida.'),
  winsRefs: z.array(z.string().uuid('Referência de prêmios inválida.')),
  pixType: z.nativeEnum(withdrawal_pix_type, { message: 'Tipo de chave PIX inválida.' }),
  pixKey: z
    .string()
    .min(14, 'Chave PIX inválida.')
    .max(18, 'Limite de caracteres: 18.')
    .refine(data => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data) || /^\(\d{2}\) \d \d{4}-\d{4}$/.test(data), 'Chave PIX inválida.')
})

export class Withdrawal {
  private props: WithdrawalProps

  get id() {
    return this.props.id
  }

  get ref() {
    return this.props.ref
  }

  get userId() {
    return this.props.userId
  }

  get value() {
    return this.props.value
  }

  get pixType() {
    return this.props.pixType
  }

  get pixKey() {
    return this.props.pixKey
  }

  get status() {
    return this.props.status
  }

  get reason() {
    return this.props.reason
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get user() {
    return this.props.user
  }

  constructor(props: WithdrawalProps) {
    this.props = props
  }
}
