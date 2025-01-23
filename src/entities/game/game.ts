// packages
import { z } from 'zod'

// entities
import { privateRouteSchema } from '@/entities/route-entities'
import { User } from '../user/user'
import { Ticket } from '../ticket/ticket'
import { Winner } from '../winner/winner'

// enums
export enum game_type {
  NORMAL = 'NORMAL',
  SPECIAL = 'SPECIAL'
}

export enum formatted_game_type {
  NORMAL = 'Normal',
  SPECIAL = 'Especial'
}

export enum game_status {
  RETROACTIVE = 'RETROACTIVE',
  OPEN_SALES = 'OPEN_SALES',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED'
}

export enum formatted_game_status {
  RETROACTIVE = 'Retroativo',
  OPEN_SALES = 'Vendas Abertas',
  RUNNING = 'Em Andamento',
  FINISHED = 'Finalizado'
}

// types
export type GameProps = {
  id: number
  ref: string
  userId?: number
  dateTime: Date
  type: game_type
  ticketPrice: number
  firstPrizeValue: number
  secondPrizeValue: number
  thirdPrizeValue: number
  grantedPrizes: boolean
  status: game_status
  balls: string[]
  createdAt: Date
  updatedAt?: Date

  // relationships
  user?: User
  tickets: Ticket[]
  winners: Winner[]
}

export type UpdateGameSchema = z.infer<typeof updateGameSchema>

// schemas
export const updateGameSchema = privateRouteSchema.extend({
  ref: z.string().uuid('Referência de jogo inválida.'),
  dateTime: z
    .string()
    .min(16, 'Data e hora inválida.')
    .max(16, 'Limite de caracteres: 16.')
    .regex(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/, { message: 'Data e hora inválida.' }),
  type: z.nativeEnum(game_type, { message: 'Tipo de jogo inválido.' }),
  ticketPrice: z.coerce.number().min(0.05, 'Preço de cartela inválido.'),
  firstPrizeValue: z.coerce.number().min(1, 'Valor de primeiro prêmio inválido.'),
  secondPrizeValue: z.coerce.number().min(2, 'Valor de segundo prêmio inválido.'),
  thirdPrizeValue: z.coerce.number().min(3, 'Valor de terceiro prêmio inválido.'),
  grantedPrizes: z.boolean()
})

export class Game {
  private props: GameProps

  get id() {
    return this.props.id
  }

  get ref() {
    return this.props.ref
  }

  get dateTime() {
    return this.props.dateTime
  }

  get type() {
    return this.props.type
  }

  get ticketPrice() {
    return this.props.ticketPrice
  }

  get firstPrizeValue() {
    return this.props.firstPrizeValue
  }

  get secondPrizeValue() {
    return this.props.secondPrizeValue
  }

  get thirdPrizeValue() {
    return this.props.thirdPrizeValue
  }

  get grantedPrizes() {
    return this.props.grantedPrizes
  }

  get status() {
    return this.props.status
  }

  get balls() {
    return this.props.balls
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

  get tickets() {
    return this.props.tickets
  }

  get winners() {
    return this.props.winners
  }

  constructor(props: GameProps) {
    this.props = props
  }
}
