// packages
import { z } from 'zod'

// entities
import { privateRouteSchema } from '@/entities/route-entities'
import { User } from '../user/user'
import { Game } from '../game/game'
import { Winner } from '../winner/winner'

// types
export type TicketProps = {
  id: number
  ref: string
  userId: number
  gameId: number
  price: number
  numbers: string[]
  createdAt: Date

  // relationships
  user: User
  game: Game
  wins: Winner[]
}

export type CreateTicketsSchema = z.infer<typeof createTicketsSchema>
export type GetUserGameTicketsSchema = z.infer<typeof getUserGameTicketsSchema>

// schemas
export const createTicketsSchema = privateRouteSchema
  .extend({
    gameRef: z.string().uuid('Referência de jogo inválida.'),
    totalAmount: z.coerce.number().positive('Quantidade de cartelas inválida.'),
    totalPrice: z.coerce.number().positive('Preço total inválido.')
  })
  .refine(data => data.totalAmount % data.totalPrice === 0, 'Quantidade de cartelas ou preço inválido.')

export const getUserGameTicketsSchema = privateRouteSchema.extend({
  gameRef: z.string().uuid('Referência de jogo inválida.')
})

export class Ticket {
  private props: TicketProps

  get id() {
    return this.props.id
  }

  get ref() {
    return this.props.ref
  }

  get userId() {
    return this.props.userId
  }

  get gameId() {
    return this.props.gameId
  }

  get price() {
    return this.props.price
  }

  get numbers() {
    return this.props.numbers
  }

  get createdAt() {
    return this.props.createdAt
  }

  get user() {
    return this.props.user
  }

  get game() {
    return this.props.game
  }

  get wins() {
    return this.props.wins
  }

  constructor(props: TicketProps) {
    this.props = props
  }
}
