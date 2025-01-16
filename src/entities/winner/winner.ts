// packages
import { z } from 'zod'

// entities
import { privateRouteSchema } from '@/entities/route-entities'
import { User } from '../user/user'
import { Game } from '../game/game'
import { Ticket } from '../ticket/ticket'

// enums
export enum winner_prize_type {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD'
}

export enum formatted_winner_prize_type {
  FIRST = 'Primeiro Prêmio',
  SECOND = 'Segundo Prêmio',
  THIRD = 'Terceiro Prêmio'
}

export enum winner_prize_withdrawal_status {
  NOT_WITHDRAWN = 'NOT_WITHDRAWN',
  REQUESTED = 'REQUESTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum formatted_winner_prize_withdrawal_status {
  NOT_WITHDRAWN = 'Não Retirado',
  REQUESTED = 'Solicitado',
  WITHDRAWN = 'Retirado'
}

// types
export type WinnerProps = {
  userId: number
  gameId: number
  ticketId: number
  prizeType: winner_prize_type
  prizeValue: number
  withdrawalStatus: winner_prize_withdrawal_status

  // relationships
  user: User
  game: Game
  ticket: Ticket
}

export type CreateWinnerSchema = z.infer<typeof createWinnerSchema>

// schemas
export const createWinnerSchema = privateRouteSchema.extend({
  userRef: z.string().uuid('Referência de usuário inválida.'),
  gameRef: z.string().uuid('Referência de jogo inválida.'),
  ticketRef: z.string().uuid('Referência de catela inválida.'),
  prizeType: z.nativeEnum(winner_prize_type, { message: 'Tipo de prêmio inválido.' })
})

export class Winner {
  private props: WinnerProps

  get userId() {
    return this.props.userId
  }

  get gameId() {
    return this.props.gameId
  }

  get ticketId() {
    return this.props.ticketId
  }

  get prizeType() {
    return this.props.prizeType
  }

  get prizeValue() {
    return this.props.prizeValue
  }

  get withdrawalStatus() {
    return this.props.withdrawalStatus
  }

  get user() {
    return this.props.user
  }

  get game() {
    return this.props.game
  }

  get ticket() {
    return this.props.ticket
  }

  constructor(props: WinnerProps) {
    this.props = props
  }
}
