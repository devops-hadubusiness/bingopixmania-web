// packages
import { Dispatch, SetStateAction } from 'react'

// components
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader } from '@/components/ui/alert-dialog'

// entities
import { GameProps } from '@/entities/game/game'
import { Winner, winner_prize_type } from '@/entities/winner/winner'

// lib
import { cn } from '@/lib/utils'

// utils
import { getNumberClasses } from '@/utils/games-util'
import { formatBRL } from '@/utils/currencies-util'

// types
type WinnersAlertProps = {
  isOpenWinners: boolean
  setIsOpenWinners: Dispatch<SetStateAction<boolean>>
  className?: string
  game: GameProps
  winners: Winner[]
}

export function WinnersAlert(props: WinnersAlertProps) {
  const firstPrizeWinners = props.winners.filter(w => w.prizeType === winner_prize_type.FIRST)
  const secondPrizeWinners = props.winners.filter(w => w.prizeType === winner_prize_type.SECOND)
  const thirdPrizeWinners = props.winners.filter(w => w.prizeType === winner_prize_type.THIRD)

  return (
    <AlertDialog open={props.isOpenWinners} onOpenChange={props.setIsOpenWinners}>
      <AlertDialogContent className={`bg-primary/75 rounded-md border-none ${props.className || ''} lg:max-w-screen-lg overflow-y-auto max-h-screen`}>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <div className="w-full flex flex-col gap-y-8">
              <div className="w-full flex items-center justify-center gap-x-2">
                <span className="text-xl text-primary-foreground font-bold">VENCEDORES</span>
              </div>

              {/* FIRST PRIZE */}
              <div className="w-full flex flex-col bg-foreground rounded-lg">
                <div className="w-full flex gap-x-2 items-center justify-center bg-primary-text rounded-t-md py-1 border border-foreground">
                  <img src="/images/misc/trophies/bronze.png" className="size-6 rotate-[25deg] skeleton-hidden" />
                  <span className="text-lg text-primary-foreground font-bold">1º PRÊMIO</span>
                </div>

                {firstPrizeWinners.map((w, i) => (
                  <div key={i} className={cn('w-full flex bg-primary py-0.5 border-x border-t border-foreground', i == firstPrizeWinners.length - 1 && 'border-b border-x rounded-b-lg')}>
                    <div className="flex flex-1 items-center justify-end pr-2 border-r border-foreground">
                      <span className="text-sm text-primary-foreground">{String(w.ticket.id).padStart(6, '0')}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center truncate px-2">
                      <span className="text-sm text-primary-foreground">{w.user.name}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-start pl-2 border-l border-foreground">
                      <span className="text-sm text-primary-foreground">{formatBRL(w.prizeValue)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECOND PRIZE */}
              <div className="w-full flex flex-col bg-foreground rounded-lg">
                <div className="w-full flex gap-x-2 items-center justify-center bg-primary-text rounded-t-md py-1 border border-foreground">
                  <img src="/images/misc/trophies/silver.png" className="size-6 rotate-[25deg] skeleton-hidden" />
                  <span className="text-lg text-primary-foreground font-bold">2º PRÊMIO</span>
                </div>

                {secondPrizeWinners.map((w, i) => (
                  <div key={i} className={cn('w-full flex bg-primary py-0.5 border-x border-t border-foreground', i == secondPrizeWinners.length - 1 && 'border-b border-x rounded-b-lg')}>
                    <div className="flex flex-1 items-center justify-end pr-2 border-r border-foreground">
                      <span className="text-sm text-primary-foreground">{String(w.ticket.id).padStart(6, '0')}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center truncate px-2">
                      <span className="text-sm text-primary-foreground">{w.user.name}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-start pl-2 border-l border-foreground">
                      <span className="text-sm text-primary-foreground">{formatBRL(w.prizeValue)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* THIRD PRIZE */}
              <div className="w-full flex flex-col bg-foreground rounded-lg">
                <div className="w-full flex gap-x-2 items-center justify-center bg-primary-text rounded-t-md py-1 border border-foreground">
                  <img src="/images/misc/trophies/gold.png" className="size-6 rotate-[25deg] skeleton-hidden" />
                  <span className="text-lg text-primary-foreground font-bold">3º PRÊMIO</span>
                </div>

                {thirdPrizeWinners.map((w, i) => (
                  <div key={i} className={cn('w-full flex bg-primary py-0.5 border-x border-t border-foreground', i == thirdPrizeWinners.length - 1 && 'border-b border-x rounded-b-lg')}>
                    <div className="flex flex-1 items-center justify-end pr-2 border-r border-foreground">
                      <span className="text-sm text-primary-foreground">{String(w.ticket.id).padStart(6, '0')}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center truncate px-2">
                      <span className="text-sm text-primary-foreground">{w.user.name}</span>
                    </div>

                    <div className="flex flex-1 items-center justify-start pl-2 border-l border-foreground">
                      <span className="text-sm text-primary-foreground">{formatBRL(w.prizeValue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
