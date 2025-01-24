// packages
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'
import { GameTicketsSection } from '@/components/sections/game-tickets-section'

// entities
import { ConfigProps } from '@/entities/config/config'
import { GameProps } from '@/entities/game/game'
import { createTicketsSchema, CreateTicketsSchema, TicketProps } from '@/entities/ticket/ticket'

// lib
import { api } from '@/lib/axios'
import { showConfirm, showSuccess } from '@/lib/alerts'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// hooks
import { useToast } from '@/hooks/use-toast'

// utils
import { formatBRL } from '@/utils/currencies-util'

// types
type BuyTicketsFormProps = {
  parentLoading: boolean
  configs?: ConfigProps
  game: GameProps
  onBoughtTickets?: (boughtTickets: TicketProps[]) => void
}
type OperationTypeProps = 'ADDITION' | 'SUBTRACTION' | 'REPLACE'

// variables
const loc = `@/components/forms/buy-tickets-form`

export function BuyTicketsForm({ parentLoading, configs, game, onBoughtTickets }: BuyTicketsFormProps) {
  const { user, udpateUserBalance } = useAuthStore()
  const { toast } = useToast()
  const homeNextGameTicketsSectionRef = useRef(null)
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)
  const ticketPrice = Number(game.ticketPrice || configs?.defaultTicketPrice)
  
  const form = useForm<CreateTicketsSchema>({
    resolver: zodResolver(createTicketsSchema),
    defaultValues: {
      userRef: user?.ref,
      gameRef: game.ref,
      totalAmount: 1,
      totalPrice: ticketPrice
    }
  })

  const [totalAmount, totalPrice] = useWatch({ control: form.control, name: ['totalAmount', 'totalPrice'] })

  const _buyTickets = async () => {
    try {
      const confirm = await showConfirm('Deseja confirmar?')
      if (!confirm.isConfirmed) return

      setIsLoading(true)

      const response = await api.post(`/`, {
        ...form.getValues(),
        action: 'tickets'
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.CREATED) {
        toast({ variant: 'info', title: 'TODO', description: 'Antes de comprar vai mostrar o modal de pix.' })
        showSuccess('Cartelas compradas com sucesso')
        udpateUserBalance(response.data.body[0].balance)
        form.reset()
        if (homeNextGameTicketsSectionRef.current) await homeNextGameTicketsSectionRef.current.fetchUserNextGameTickets()
        if (onBoughtTickets) onBoughtTickets(response.data.body[0].tickets)
      } else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível comprar as cartelas.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._buyTickets function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível comprar as cartelas.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _handleUpdateTicketsAmount = (amount: number, operationType: OperationTypeProps, evt?: ChangeEvent<HTMLInputElement>) => {
    let totalValue: number, replaceValue: string

    switch (operationType) {
      case 'ADDITION':
        totalValue = (totalAmount + amount) * ticketPrice
        if (totalValue <= Number(user?.balance)) form.setValue('totalAmount', totalAmount + amount)
        else {
          const maxAmount = Math.floor(Number(user?.balance) / ticketPrice)
          if (totalAmount != maxAmount) form.setValue('totalAmount', maxAmount)
        }
        break

      case 'SUBTRACTION':
        if (totalAmount - amount >= 1) form.setValue('totalAmount', totalAmount - amount)
        break

      case 'REPLACE':
        evt?.preventDefault()
        replaceValue = evt?.target.value as string

        if (isNaN(Number(replaceValue)) || Number(replaceValue) <= 0) form.setValue('totalAmount', 1)
        else {
          totalValue = Number(replaceValue) * ticketPrice
          if (totalValue <= Number(user?.balance)) form.setValue('totalAmount', Number(replaceValue))
          else {
            const maxAmount = Math.floor(Number(user?.balance) / ticketPrice)
            if (totalAmount != maxAmount) form.setValue('totalAmount', maxAmount)
          }
        }
        break
    }
  }

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  useEffect(() => {
    form.setValue('totalPrice', totalAmount * ticketPrice)
  }, [totalAmount])

  return (
    <>
      <div className="bg-foreground flex flex-col gap-y-2 rounded-lg p-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_buyTickets)} className="flex flex-col gap-2 text-background">
            <span className="text-success font-bold text-md"> Saldo: {formatBRL(user?.balance)}</span>

            {/* AMOUNT SECTION */}
            <div className="flex w-full justify-between items-center gap-x-2">
              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(1, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">1</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(5, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">5</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(10, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">10</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(20, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">20</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(30, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">30</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(40, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">40</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(50, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">50</span>
              </Button>

              <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(100, 'ADDITION')}>
                <span className="font-semibold text-primary-foreground text-md">100</span>
              </Button>
            </div>

            {/* FORM SECTION */}
            <div className="flex flex-nowrap w-full justify-between items-center gap-x-4">
              <div className="flex items-center w-1/2 h-full">
                <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(1, 'SUBTRACTION')}>
                  <Minus className="size-4 text-primary-foreground" />
                </Button>

                <Input
                  value={totalAmount}
                  onChange={evt => _handleUpdateTicketsAmount(0, 'REPLACE', evt)}
                  className="!text-center text-md text-background font-semibold rounded-none !h-8 !bg-transparent !border-x-none !border-y !border-muted-foreground"
                  disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0 || totalAmount <= 0}
                />

                <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0} onClick={() => _handleUpdateTicketsAmount(1, 'ADDITION')}>
                  <Plus className="size-4 text-primary-foreground" />
                </Button>
              </div>

              <div className="flex items-center w-1/2 h-full">
                <div className="flex items-center justify-center flex-grow border-l border-y border-muted-foreground max-h-full py-[3px] hover:cursor-not-allowed">
                  <span className="text-md text-background font-semibold text-muted-foreground">{formatBRL(totalPrice)}</span>
                </div>

                <Button type="submit" variant="default" className="h-full flex items-center justify-center rounded-none text-xs bg-success hover:bg-success hover:brightness-125" disabled={isLoading || isNaN(ticketPrice) || ticketPrice <= 0 || totalAmount <= 0} onClick={_buyTickets}>
                  <Check className="size-4 text-primary-foreground" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* TICKETS */}
      <GameTicketsSection ref={homeNextGameTicketsSectionRef} parentLoading={parentLoading} game={game} />
    </>
  )
}
