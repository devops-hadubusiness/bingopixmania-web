// packages
import { useState, useEffect } from 'react'
import { ShoppingCart, Dices } from 'lucide-react'

// components
import { Avatar } from '@/components/ui/avatar'
import { CustomNoData } from '@/components/data/custom-no-data'
import { Button } from '@/components/ui/button'
import { BuyTicketsAlert } from '@/components/alerts/buy-tickets-alert'

// entities
import { formatted_game_status, game_status, game_type, GameProps } from '@/entities/game/game'
import { TicketProps } from '@/entities/ticket/ticket'

// hooks
import { useToast } from '@/hooks/use-toast'

// lib
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

// store
import { useAuthStore } from '@/store/auth'

// utils
import { formatBRL } from '@/utils/currencies-util'
import { formatTimestampToPattern } from '@/utils/dates-util'

// constants
import { HTTP_STATUS_CODE } from '@/constants/http'

// variables
const loc = `@/pages/SpecialGames`

export default function SpecialGamesPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [selectedGame, setSelectedGame] = useState<GameProps | undefined>()
  const [isBuyTicketsModalOpen, setIsBuyTicketsModalOpen] = useState<boolean>(false)

  const _fetchGamesByTypesAndStatus = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/`, {
        params: {
          action: 'games_by_types_and_status',
          userRef: user?.ref,
          types: JSON.stringify([game_type.SPECIAL]),
          status: JSON.stringify([game_status.OPEN_SALES])
        }
      })

      if ([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_FOUND].includes(response.data?.statusCode)) setGames(response.data.body)
      else toast({ variant: 'destructive', title: 'Ops ...', description: response.data?.statusMessage || 'Não foi possível buscar os jogos.' })
    } catch (err) {
      console.error(`Unhandled rejection at ${loc}._fetchGamesByTypesAndStatus function. Details: ${err}`)
      toast({ variant: 'destructive', title: 'Ops ...', description: 'Não foi possível buscar os jogos.' })
    } finally {
      setIsLoading(false)
    }
  }

  const _handleBoughtTickets = (boughtTickets: TicketProps[]) => {
    console.log(boughtTickets)
    if (selectedGame && boughtTickets.length) {
      const updatedGames = games.slice()
      const selectedGameIndex = games.findIndex(g => g.id === selectedGame.id)

      if (selectedGameIndex != -1 && games[selectedGameIndex]) {
        updatedGames.splice(selectedGameIndex, 1, {
          ...games[selectedGameIndex],
          tickets: boughtTickets
        })

        setGames(updatedGames)
      }
    }

    setSelectedGame(undefined)
  }

  useEffect(() => {
    setIsBuyTicketsModalOpen(!!selectedGame)
  }, [selectedGame])

  useEffect(() => {
    _fetchGamesByTypesAndStatus()
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        {isLoading || games.length ? (
          (games.length ? games : new Array(3).fill({})).map((game: GameProps, i) => (
            <div key={i} className={cn('rounded-lg bg-accent p-4 flex flex-col gap-y-4 w-full hover:bg-accent/50 hover:cursor-pointer relative', isLoading && 'skeleton', game.tickets?.length && 'pb-10')}>
              <div className="flex w-full justify-between">
                <span className="text-muted-foreground font-semibold text-xs">{formatTimestampToPattern(game.dateTime, 'dd/MM/yyyy HH:mm')}</span>

                <span className="font-bold text-sm text-success">{formatted_game_status.OPEN_SALES}</span>
              </div>

              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-md text-success">PARTIDA #{String(game.id).padStart(6, '0')}</span>
                  <span className="text-primary-foreground font-bold text-md">VALOR {formatBRL(game.ticketPrice)}</span>
                </div>

                <div className="flex items-center justify-center h-full">
                  <Avatar className="size-10 rounded-full flex items-center justify-center bg-success">
                    <ShoppingCart />
                  </Avatar>
                </div>
              </div>

              <div className="flex w-full justify-between items-center">
                {[game.firstPrizeValue, game.secondPrizeValue, game.thirdPrizeValue].map((prizeValue, j) => (
                  <div key={j} className="flex-grow flex flex-col items-center justify-center">
                    <span className="text-sm text-primary-foreground font-semibold">Prêmio {j + 1}</span>
                    <span className="text-md text-primary-foreground font-bold">{formatBRL(prizeValue)}</span>
                  </div>
                ))}
              </div>

              <div className="flex w-full justify-center items-center">
                <Button variant="default" type="button" className="w-full bg-success/50 hover:bg-success" onClick={() => setSelectedGame(game)}>
                  <span className="text-xs text-foreground font-semibold">COMPRAR CARTELAS</span>
                </Button>
              </div>

              {!!game.tickets?.length && (
                <div className="absolute bottom-0 left-0 w-full flex items-center justify-between px-4 bg-success/25 rounded-b-lg py-1">
                  <span className="text-xs text-foreground">Cartelas compradas: {game.tickets.length || 0}</span>

                  <span className="text-xs text-foreground">Total: {formatBRL(game.tickets.reduce((total, current) => (total += current.price), 0))}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <CustomNoData title="Nenhum jogo encontrado" description="Aguarde o início de um jogo para comprar as cartelas." icon={Dices} iconClass={'size-16'} className="mt-16 smAndDown:min-w-screen smAndDown:max-w-screen mdAndUp:max-w-[475px] mdAndUp:min-w-[475px]" />
        )}
      </div>

      {isBuyTicketsModalOpen && selectedGame && <BuyTicketsAlert open={isBuyTicketsModalOpen} game={selectedGame} cb={_handleBoughtTickets} />}
    </div>
  )
}
