// packages
import { useEffect, useState } from 'react'
import { Flame, Gift } from 'lucide-react'

// components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// entities
import { game_type, GameProps } from '@/entities/game/game'

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
import { formatTimestampToPattern } from '@/utils/dates-util'

// types
type HomeNextGameSectionProps = {
  parentLoading: boolean
}

// variables
const loc = `@/components/sections/home-next-game-section`

export function HomeNextGameSection({ parentLoading }: HomeNextGameSectionProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)
  const [nextGame, setNextGame] = useState<GameProps | undefined>()

  const _fetchNextGame = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'games_next',
          userRef: user?.ref
        }
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setNextGame(response.data.body[0])
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar o próximo jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchNextGame function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar o próximo jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  useEffect(() => {
    _fetchNextGame()
  }, [])

  return (
    <>
      <div className="flex w-full justify-between items-center border border-2 border-primary-text rounded-md py-2 relative">
        {nextGame?.type === game_type.SPECIAL && (
          <div className="absolute -left-3 -top-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="m-auto relative">
                  <Flame className="size-8 p-1.5 text-foreground bg-primary rounded-full relative" />
                </TooltipTrigger>

                <TooltipContent className="bg-primary rounded-lg border-primary-text py-1">
                  <span className="text-xs text-foreground">Rodada Especial</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {nextGame && !nextGame?.grantedPrizes && (
          <div className="absolute -right-3 -top-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="m-auto relative">
                  <Gift className="size-8 p-1.5 text-foreground bg-primary rounded-full relative" />
                </TooltipTrigger>

                <TooltipContent className="bg-primary rounded-lg border-primary-text py-1">
                  <span className="text-xs text-foreground">Prêmio Garantido</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-1 flex-grow">
          <span className="font-semibold text-primary-text text-md">Sorteio</span>
          <span className={cn('font-semibold text-background text-sm', (isLoading || !nextGame?.id) && 'skeleton min-w-[50px] h-5')}>{String(nextGame?.id).padStart(6, '0')}</span>
        </div>

        <div className="flex flex-col items-center justify-center border-x border-primary-text gap-1 flex-grow">
          <span className="font-semibold text-primary-text text-md">Doação</span>
          <span className={cn('font-semibold text-background text-sm', (isLoading || !nextGame?.ticketPrice) && 'skeleton min-w-[50px] h-5')}>{formatBRL(nextGame?.ticketPrice as number)}</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 flex-grow">
          <span className="font-semibold text-primary-text text-md">Hora</span>
          <span className={cn('font-semibold text-background text-sm', (isLoading || !nextGame?.dateTime) && 'skeleton min-w-[50px] h-5')}>{nextGame?.dateTime ? formatTimestampToPattern(nextGame?.dateTime, 'dd/MM HH:mm') : ''} </span>
        </div>
      </div>

      {/* PRIZES SECTION */}
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex w-full justify-between items-center bg-primary rounded-md p-3">
          <div className="flex items-center gap-x-4">
            <span className="text-xl text-primary-foreground font-bold">1º PRÊMIO</span>
            <img src="/images/misc/trophies/bronze.png" className="size-8 rotate-[25deg] skeleton-hidden" />
          </div>

          <span className={cn('text-xl text-primary-foreground font-bold', (isLoading || !nextGame?.firstPrizeValue) && 'skeleton min-w-[50px] h-8')}>{formatBRL(nextGame?.firstPrizeValue as number)}</span>
        </div>

        <div className="flex w-full justify-between items-center bg-primary rounded-md p-3">
          <div className="flex items-center gap-x-4">
            <span className="text-xl text-primary-foreground font-bold">2º PRÊMIO</span>
            <img src="/images/misc/trophies/silver.png" className="size-8 rotate-[25deg] skeleton-hidden" />
          </div>

          <span className={cn('text-xl text-primary-foreground font-bold', (isLoading || !nextGame?.secondPrizeValue) && 'skeleton min-w-[50px] h-8')}>{formatBRL(nextGame?.secondPrizeValue as number)}</span>
        </div>

        <div className="flex w-full justify-between items-center bg-primary rounded-md p-3 smalltobig">
          <div className="flex items-center gap-x-4">
            <span className="text-xl text-primary-foreground font-bold">3º PRÊMIO</span>
            <img src="/images/misc/trophies/gold.png" className="size-8 rotate-[25deg] skeleton-hidden" />
          </div>

          <span className={cn('text-xl text-primary-foreground font-bold', (isLoading || !nextGame?.thirdPrizeValue) && 'skeleton min-w-[50px] h-8')}>{formatBRL(nextGame?.thirdPrizeValue as number)}</span>
        </div>
      </div>
    </>
  )
}
