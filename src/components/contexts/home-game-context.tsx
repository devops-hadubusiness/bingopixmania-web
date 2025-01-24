// packages
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns-tz'

// components
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { GameTicketsSection } from '@/components/sections/game-tickets-section'

// entities
import { GameProps } from '@/entities/game/game'
import { winner_prize_type } from '@/entities/winner/winner'

// utils
import { formatBRL } from '@/utils/currencies-util'
import { timeZone, formatTimestampToPattern } from '@/utils/dates-util'
import { getNumberClasses } from '@/utils/games-util'

// lib
import { cn } from '@/lib/utils'

// types
import {ClosestGameWinnerProps} from '@/types/game-types'
type HomeGameContextProps = {
  parentLoading: boolean
  game: GameProps
  closest: ClosestGameWinnerProps[]
}

export function HomeGameContext({ parentLoading, game, closest }: HomeGameContextProps) {
  const _hasWinner = (prizeType: winner_prize_type) => {
    return game.winners?.some(w => w.prizeType === prizeType)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
      {/* PRIZES */}
      <div className="flex gap-x-4 w-full">
        <div className={cn('flex flex-col items-center justify-center gap-y-2 rounded-md p-2 w-1/3', !_hasWinner(winner_prize_type.FIRST) ? 'bg-primary/50 border border-primary-text' : 'bg-accent')}>
          <span className={cn('w-full text-center text-primary-foreground rounded-lg text-xs font-bold', !_hasWinner(winner_prize_type.FIRST) && 'bg-primary-text')}>Prêmio 1</span>
          <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.firstPrizeValue) && 'skeleton')}>{formatBRL(game.firstPrizeValue)}</span>
        </div>

        <div className={cn('flex flex-col items-center justify-center gap-y-2 rounded-md p-2 w-1/3', _hasWinner(winner_prize_type.FIRST) && !_hasWinner(winner_prize_type.SECOND) ? 'bg-primary/50 border border-primary-text' : 'bg-accent')}>
          <span className={cn('w-full text-center text-primary-foreground rounded-lg text-xs font-bold', _hasWinner(winner_prize_type.FIRST) && !_hasWinner(winner_prize_type.SECOND) && 'bg-primary-text')}>Prêmio 2</span>
          <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.secondPrizeValue) && 'skeleton')}>{formatBRL(game.secondPrizeValue)}</span>
        </div>

        <div className={cn('flex flex-col items-center justify-center gap-y-2 rounded-md p-2 w-1/3', _hasWinner(winner_prize_type.FIRST) && _hasWinner(winner_prize_type.SECOND) ? 'bg-primary/50 border border-primary-text' : 'bg-accent')}>
          <span className={cn('w-full text-center text-primary-foreground rounded-lg text-xs font-bold', _hasWinner(winner_prize_type.FIRST) && _hasWinner(winner_prize_type.SECOND) && 'bg-primary-text')}>Prêmio 3</span>
          <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.thirdPrizeValue) && 'skeleton')}>{formatBRL(game.thirdPrizeValue)}</span>
        </div>
      </div>

      {/* BALL */}
      <div className="flex items-center justify-between gap-x-4 w-full bg-accent/50 rounded-md">
        {/* CARDS */}
        <div className="flex flex-col gap-y-2 h-full flex-grow">
          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Sorteio</span>
            <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.id) && 'skeleton')}>{String(game?.id).padStart(6, '0')}</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Doação</span>
            <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.ticketPrice) && 'skeleton')}>{formatBRL(game.ticketPrice)}</span>
          </div>

          {/* TODO: ver se está certo a data do jogo */}
          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Data</span>
            <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.dateTime) && 'skeleton')}>{formatTimestampToPattern(game.dateTime, 'dd/MM/yyyy')}</span>
          </div>

          {/* TODO: ver se está certo a hora do jogo */}
          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Hora</span>
            <span className={cn('text-primary-foreground rounded-lg text-xs', (parentLoading || !game?.dateTime) && 'skeleton')}>{formatTimestampToPattern(game.dateTime, 'HH:mm:ss')}</span>
          </div>
        </div>

        {/* BALL */}
        <div className="flex items-center justify-center h-full flex-grow">
          <Avatar className={cn('size-48 border-2 border-primary-foreground rounded-full', game.balls?.at(-1) && 'bg-foreground')}>
            {/* <img src={`/images/misc/balls/bola-${game.balls?.length ? game.balls.at(-1) : 'vazia'}.png`} className="size-48" /> */}
            <AvatarImage src={`/images/misc/balls/bola-${game.balls.at(-1) ?? 'vazia'}.png`} />
          </Avatar>
        </div>

        {/* BALLS */}
        <div className="flex flex-col items-center gap-y-4 h-full flex-grow">
          <Avatar className={cn('size-16 border-2 border-primary-foreground rounded-full', game.balls?.at(-2) && 'bg-foreground')}>
            <AvatarImage src={`/images/misc/balls/bola-${game.balls.at(-2) ?? 'vazia'}.png`} />
          </Avatar>

          <Avatar className={cn('size-12 border-2 border-primary-foreground rounded-full', game.balls?.at(-3) && 'bg-foreground')}>
            <AvatarImage src={`/images/misc/balls/bola-${game.balls.at(-3) ?? 'vazia'}.png`} />
          </Avatar>

          <Avatar className={cn('size-9 border-2 border-primary-foreground rounded-full', game.balls?.at(-4) && 'bg-foreground')}>
            <AvatarImage src={`/images/misc/balls/bola-${game.balls.at(-4) ?? 'vazia'}.png`} />
          </Avatar>
        </div>
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-y-2 w-full items-end">
        <span className="text-primary-text text-sm font-bold">ORDEM {game.balls?.length || 0}</span>

        <div className="flex flex-col gap-y-[1.5px] py-2 px-1 bg-primary/50 rounded-lg w-full">
          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 1), game.status))}>
                {i + 1}
              </span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i + 16} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 16), game.status))}>
                {i + 16}
              </span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i + 31} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 31), game.status))}>
                {i + 31}
              </span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i + 46} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 46), game.status))}>
                {i + 46}
              </span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i + 61} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 61), game.status))}>
                {i + 61}
              </span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i + 76} className={cn('px-2 py-1 rounded-sm text-[8px] font-bold text-center w-[6.66%]', getNumberClasses(game.balls, String(i + 76), game.status))}>
                {i + 76}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full bg-primary rounded-lg p-1 flex flex-wrap">
        {/* <CustomDataTable columns={columns} data={new Array(8).fill(' ')} hideFilterInput={true} /> */}
        <div className="flex w-full">
          <span className="w-3/12 text-center font-bold text-sm text-primary-foreground">CARTELA</span>
          <span className="w-4/12 text-center font-bold text-sm text-primary-foreground">DOADOR</span>
          <span className="w-5/12 text-center font-bold text-sm text-primary-foreground">FALTAM</span>
        </div>

        <div className="flex w-full gap-x-0.5">
          <div className="flex flex-col gap-y-0.5 flex-grow h-full">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-foreground rounded-md px-4 py-1 w-full flex items-center justify-center h-full">
                <span className="text-xs font-bold text-primary-text">{closest?.[i]?.ticket?.id ? String(closest?.[i]?.ticket?.id).padStart(6, '0') : ''}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-0.5 flex-grow h-full">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i + 10} className="bg-foreground rounded-md px-4 py-1 w-full flex items-center justify-center h-full">
                <span className="text-xs font-bold text-background">{closest?.[i]?.ticket?.user?.name || '\u00A0'}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-0.5 w-5/12 h-full">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i + 20} className="flex gap-x-1">
                <div className={cn("flex items-center justify-center p-2 rounded-md w-[20%]", closest?.[i]?.remainingNumbers?.at(0) ? 'bg-primary-text text-primary-foreground' : 'bg-muted-foreground text-accent')}>
                  <span className="font-bold text-xs">{closest?.[i]?.remainingNumbers?.at(0) || '\u00A0'}</span>
                </div>

                <div className={cn("flex items-center justify-center p-2 rounded-md w-[20%]", closest?.[i]?.remainingNumbers?.at(1) ? 'bg-primary-text text-primary-foreground' : 'bg-muted-foreground text-accent')}>
                  <span className="font-bold text-xs">{closest?.[i]?.remainingNumbers?.at(1) || '\u00A0'}</span>
                </div>

                <div className={cn("flex items-center justify-center p-2 rounded-md w-[20%]", closest?.[i]?.remainingNumbers?.at(2) ? 'bg-primary-text text-primary-foreground' : 'bg-muted-foreground text-accent')}>
                  <span className="font-bold text-xs">{closest?.[i]?.remainingNumbers?.at(2) || '\u00A0'}</span>
                </div>

                <div className={cn("flex items-center justify-center p-2 rounded-md w-[20%]", closest?.[i]?.remainingNumbers?.at(3) ? 'bg-primary-text text-primary-foreground' : 'bg-muted-foreground text-accent')}>
                  <span className="font-bold text-xs">{closest?.[i]?.remainingNumbers?.at(3) || '\u00A0'}</span>
                </div>

                <div className={cn("flex items-center justify-center p-2 rounded-md w-[20%]", closest?.[i]?.remainingNumbers?.at(4) ? 'bg-primary-text text-primary-foreground' : 'bg-muted-foreground text-accent')}>
                  <span className="font-bold text-xs">{closest?.[i]?.remainingNumbers?.at(4) || '\u00A0'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GameTicketsSection parentLoading={parentLoading} game={game} sort={true} />
    </div>
  )
}
