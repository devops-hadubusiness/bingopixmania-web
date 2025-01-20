// packages
import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

// components
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// entities
import { TicketProps } from '@/entities/ticket/ticket'

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
type HomeNextGameTicketsProps = {
  parentLoading: boolean
}

// variables
const loc = `@/components/sections/home-next-game-section`

export function HomeNextGameTicketsSection({ parentLoading }: HomeNextGameTicketsProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)
  const [tickets, setTickets] = useState<TicketProps | undefined>()

  const _fetchUserNextGameTickets = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'games_next_user_tickets',
          userRef: user?.ref
        }
      })
      console.log(response.data.body[0])
      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setTickets(response.data.body[0])
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o próximo jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchUserNextGameTickets function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o próximo jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  useEffect(() => {
    _fetchUserNextGameTickets()
  }, [])

  return (
    <>
      <div className="bg-primary flex items-center py-2 rounded-lg w-full">
        <div className="w-1/2 flex justify-end gap-x-2 border-r border-primary-foreground pr-2">
          <span className="text-lg text-primary-foreground font-bold">SALDO</span>
          <span className="text-lg text-success font-bold">R$ 0,00</span>
        </div>

        <div className="w-1/2 flex gap-x-2 border-l border-primary-foreground pl-2">
          <span className="text-lg text-primary-foreground font-bold">COMPRADAS</span>
          <span className="text-lg text-success font-bold">0</span>
        </div>
      </div>

      {/* TODO: criar cartelinhas visuais, e caso não tenha, exibir banner */}

      <div className="bg-primary/50 px-8 py-16 flex items-center justify-center rounded-lg w-full">
        <span className="text-2xl text-primary-foreground">BANNER AQUI</span>
      </div>
    </>
  )
}
