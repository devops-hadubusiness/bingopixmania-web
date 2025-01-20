// packages
import { ChangeEvent, useEffect, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'

// components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HomeNextGameTicketsSection } from '@/components/sections/home-next-game-tickets-section'

// entities
import { ConfigProps } from '@/entities/config/config'

// lib
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

// store
import { useAuthStore } from '@/store/auth'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// hooks
import { useToast } from '@/hooks/use-toast'

// utils
import { formatBRL } from '@/utils/currencies-util'

// types
type HomeBuyTicketsSectionProps = {
  parentLoading: boolean
  configs?: ConfigProps
}
type OperationTypeProps = 'ADDITION' | 'SUBTRACTION' | 'REPLACE'

// variables
const loc = `@/components/sections/home-next-game-section`

export function HomeBuyTicketsSection({ parentLoading, configs }: HomeBuyTicketsSectionProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)
  const [ticketsAmount, setTicketsAmount] = useState<number>(1)

  const _buyTickets = async () => {
    try {
      // TODO: verificar se tem saldo suficiente

      // TODO: show confirmation
      
      setIsLoading(true)

      /* const response = await api.get(`/`, {
        params: {
          action: 'games_next',
          userRef: user?.ref
        }
      })
      console.log(response.data.body[0])
      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setNextGame(response.data.body[0])
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível comprar as cartelas.' }) */
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
        totalValue = (ticketsAmount + amount) * Number(configs?.defaultTicketPrice)
        if (totalValue <= Number(user?.balance)) setTicketsAmount(prev => prev + amount)
        else setTicketsAmount(Math.floor(Number(user?.balance) / Number(configs?.defaultTicketPrice)))
        break

      case 'SUBTRACTION':
        if (ticketsAmount - amount >= 1) setTicketsAmount(prev => prev - amount)
        break

      case 'REPLACE':
        evt?.preventDefault()
        replaceValue = evt?.target.value as string

        if (isNaN(Number(replaceValue)) || Number(replaceValue) <= 0) setTicketsAmount(1)
        else {
          totalValue = Number(replaceValue) * Number(configs?.defaultTicketPrice)
          if (totalValue <= Number(user?.balance)) setTicketsAmount(Number(replaceValue))
          else setTicketsAmount(Math.floor(Number(user?.balance) / Number(configs?.defaultTicketPrice)))
        }
        break
    }
  }

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  return (
    <>
      <div className="bg-foreground flex flex-col gap-y-2 rounded-lg p-4 w-full">
        <span className="text-success font-bold text-md"> Saldo: {formatBRL(user?.balance)}</span>

        {/* AMOUNT SECTION */}
        <div className="flex w-full justify-between items-center gap-x-2">
          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(1, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">1</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(5, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">5</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(10, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">10</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(20, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">20</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(30, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">30</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(40, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">40</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(50, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">50</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(100, 'ADDITION')}>
            <span className="font-semibold text-primary-foreground text-md">100</span>
          </Button>
        </div>

        {/* FORM SECTION */}
        <div className="flex flex-nowrap w-full justify-between items-center gap-x-4">
          <div className="flex items-center w-1/2 h-full">
            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(1, 'SUBTRACTION')}>
              <Minus className="size-4 text-primary-foreground" />
            </Button>

            <Input
              value={ticketsAmount}
              onChange={evt => _handleUpdateTicketsAmount(0, 'REPLACE', evt)}
              className="!text-center text-md text-background font-semibold rounded-none !h-8 !bg-transparent !border-x-none !border-y !border-muted-foreground"
              disabled={isLoading || !configs?.defaultTicketPrice || isNaN(ticketsAmount) || ticketsAmount <= 0}
            />

            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none" disabled={isLoading || !configs?.defaultTicketPrice} onClick={() => _handleUpdateTicketsAmount(1, 'ADDITION')}>
              <Plus className="size-4 text-primary-foreground" />
            </Button>
          </div>

          <div className="flex items-center w-1/2 h-full">
            <div className="flex items-center justify-center flex-grow border-l border-y border-muted-foreground max-h-full py-[3px] hover:cursor-not-allowed">
              <span className="text-md text-background font-semibold text-muted-foreground">{formatBRL(ticketsAmount * configs?.defaultTicketPrice)}</span>
            </div>

            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none text-xs" disabled={isLoading || !configs?.defaultTicketPrice || isNaN(ticketsAmount) || ticketsAmount <= 0} onClick={_buyTickets}>
              <Check className="size-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* BALANCE */}
      <HomeNextGameTicketsSection parentLoading={parentLoading} />
    </>
  )
}
