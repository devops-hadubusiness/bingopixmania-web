// packages
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

// entities
import { GetUserGameTicketsSchema, TicketProps } from '@/entities/ticket/ticket'
import { GameProps } from '@/entities/game/game'
import { winner_prize_type } from '@/entities/winner/winner'

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
import { getNumberClasses } from '@/utils/games-util'

// types
import { ClosestGameWinnerProps } from '@/types/game-types'
type HomeNextGameTicketsProps = {
  parentLoading: boolean
  game: GameProps
  sort?: boolean
}

// variables
const loc = `@/components/sections/home-next-game-section`

const GameTicketsSection = forwardRef(({ parentLoading, game, sort }: HomeNextGameTicketsProps, ref) => {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(parentLoading || true)
  const [tickets, setTickets] = useState<TicketProps[]>([])

  const _fetchUserNextGameTickets = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'tickets_user_game',
          userRef: user?.ref,
          gameRef: game.ref
        } as GetUserGameTicketsSchema
      })

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) setTickets(response.data.body)
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar suas cartelas do próximo jogo.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchUserNextGameTickets function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar suas cartelas do próximo jogo.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _getSortedTickets = () => {
    // checking by third prize award condition
    if (game.winners.some(w => w.prizeType === winner_prize_type.SECOND)) {
      return tickets.sort((a, b) => b.numbers.filter(n => game.balls.includes(String(n))).length - a.numbers.filter(n => game.balls.includes(String(n))).length)
    }

    // checking by first/second prizes awards condition
    else {
      const closest: Array<{ ticket: TicketProps; totalMatches: number; maxMatches: number }> = []
      let matrix: [string[], string[], string[]]
      let totalMatches = 0
      let maxMatches = 0
      let matches: number | undefined

      for (let i = 0; i < tickets.length; i++) {
        totalMatches = 0 // reseting
        maxMatches = 0 // reseting
        matrix = [tickets[i].numbers.slice(0, 5), tickets[i].numbers.slice(5, 10), tickets[i].numbers.slice(10)]

        for (let j = 0; j < matrix.length; j++) {
          matches = matrix[j]?.filter(c => game.balls.includes(c)).length || 0
          totalMatches += matches

          // if current matrix has highest matches
          if (matches > maxMatches) maxMatches = matches
        }

        closest.push({ ticket: tickets[i], totalMatches, maxMatches })
      }

      return closest.sort((a, b) => b.maxMatches - a.maxMatches).sort((a, b) => (b.maxMatches === a.maxMatches ? b.totalMatches - a.totalMatches : b.maxMatches - a.maxMatches)).map(c => c.ticket)
    }
  }

  useEffect(() => {
    setIsLoading(parentLoading)
  }, [parentLoading])

  useEffect(() => {
    if (game && !tickets.length) _fetchUserNextGameTickets()
    else setTickets([])
  }, [game?.ref])

  useImperativeHandle(ref, () => ({
    fetchUserNextGameTickets: _fetchUserNextGameTickets
  }))

  return (
    <>
      <div className="bg-primary flex items-center py-2 rounded-lg w-full">
        <div className="w-1/2 flex justify-end items-center gap-x-2 border-r border-primary-foreground pr-2">
          <span className="text-lg text-primary-foreground font-bold">SALDO</span>
          <span className={cn('text-lg text-success font-bold', isLoading && 'skeleton min-w-[50px] h-6')}>{formatBRL(tickets.reduce((total, current) => (total += current.price), 0))}</span>
        </div>

        <div className="w-1/2 flex items-center gap-x-2 border-l border-primary-foreground pl-2">
          <span className="text-lg text-primary-foreground font-bold">COMPRADAS</span>
          <span className={cn('text-lg text-success font-bold', isLoading && 'skeleton min-w-[50px] h-6')}>{tickets.length}</span>
        </div>
      </div>

      {!!tickets.length && !isLoading && (
        <div className="grid grid-cols-2 gap-2 w-full bg-accent p-2 rounded-lg">
          {(sort ? _getSortedTickets() : tickets).map((t, i) => (
            <div key={i} className="col-span-1 flex flex-col border-2 border-primary-text rounded-lg bg-primary/25 rounded-lg">
              <div className="w-full text-center border-b-2 border-primary-text truncate bg-primary/50">
                <span className="text-xs font-bold">{user?.name || '-'}</span>
              </div>

              <div className="flex w-full justify-end">
                {t.numbers.slice(0, 5).map((n, j) => (
                  <span key={j} className={cn('w-1/5 py-1 text-[8px] font-bold text-center border border-primary-text', getNumberClasses(game.balls, n, game.status))}>
                    {n}
                  </span>
                ))}
              </div>

              <div className="flex w-full justify-end">
                {t.numbers.slice(5, 10).map((n, j) => (
                  <span key={j} className={cn('w-1/5 py-1 text-[8px] font-bold text-center border border-primary-text', getNumberClasses(game.balls, n, game.status))}>
                    {n}
                  </span>
                ))}
              </div>

              <div className="flex w-full justify-end">
                {t.numbers.slice(10).map((n, j) => (
                  <span key={j} className={cn('w-1/5 py-1 text-[8px] font-bold text-center border border-primary-text', getNumberClasses(game.balls, n, game.status))}>
                    {n}
                  </span>
                ))}
              </div>

              <div className="w-full text-center border-t-2 border-primary-text truncate bg-primary/50">
                <span className="text-xs font-bold">{String(t?.id).padStart(6, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(!tickets.length || isLoading) && (
        <div className="bg-primary/50 px-8 py-16 flex items-center justify-center rounded-lg w-full">
          <span className="text-2xl text-primary-foreground">BANNER AQUI</span>
        </div>
      )}
    </>
  )
})

GameTicketsSection.displayName = 'GameTicketsSection'

export { GameTicketsSection }
