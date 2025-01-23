// packages
import { z } from 'zod'

// entities
import { privateRouteSchema } from '@/entities/route-entities'

// types
export type ConfigProps = {
  id: number
  ref: string
  minDepositValue: number
  minGameTotalValueMultiplicator: number
  defaultFirstPrizeValue: number
  defaultSecondPrizeValue: number
  defaultThirdPrizeValue: number
  defaultTicketPrice: number
  defaultTimeBetweenGames: number
  isActiveHomePopup: boolean
  isActiveDepositBonus: boolean
  createdAt: Date
  updatedAt?: Date
}

export type UpsertConfigsSchema = z.infer<typeof upsertConfigsSchema>

// schemas
export const upsertConfigsSchema = privateRouteSchema.extend({
  minDepositValue: z.coerce.number().min(0, 'Valor mínimo de depósito inválido.'),
  minGameTotalValueMultiplicator: z.coerce.number().min(0, 'Multiplicador de valor total mínimo do jogo inválido.'),
  defaultFirstPrizeValue: z.coerce.number().min(0, 'Valor do primeiro prêmio inválido.'),
  defaultSecondPrizeValue: z.coerce.number().min(0, 'Valor do segundo prêmio inválido.'),
  defaultThirdPrizeValue: z.coerce.number().min(0, 'Valor do terceiro prêmio inválido.'),
  defaultTicketPrice: z.coerce.number().min(0, 'Preço mínimo de cartela inválido.'),
  defaultTimeBetweenGames: z.coerce.number().min(0, 'Tempo entre jogos inválido.'),
  isActiveHomePopup: z.boolean(),
  isActiveDepositBonus: z.boolean()
})

export class Config {
  private props: ConfigProps

  get id() {
    return this.props.id
  }

  get ref() {
    return this.props.ref
  }

  get minDepositValue() {
    return this.props.minDepositValue
  }

  get minGameTotalValueMultiplicator() {
    return this.props.minGameTotalValueMultiplicator
  }

  get defaultFirstPrizeValue() {
    return this.props.defaultFirstPrizeValue
  }

  get defaultSecondPrizeValue() {
    return this.props.defaultSecondPrizeValue
  }

  get defaultThirdPrizeValue() {
    return this.props.defaultThirdPrizeValue
  }

  get defaultTicketPrice() {
    return this.props.defaultTicketPrice
  }

  get defaultTimeBetweenGames() {
    return this.props.defaultTimeBetweenGames
  }

  get isActiveHomePopup() {
    return this.props.isActiveHomePopup
  }

  get isActiveDepositBonus() {
    return this.props.isActiveDepositBonus
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  constructor(props: ConfigProps) {
    this.props = props
  }
}
