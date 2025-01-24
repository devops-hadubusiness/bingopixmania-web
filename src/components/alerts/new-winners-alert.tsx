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

// types
type NewWinnersAlertProps = {
  isOpenWinners: boolean
  setIsOpenWinners: Dispatch<SetStateAction<boolean>>
  className?: string
  game: GameProps
  newWinners: Winner[]
}

export function NewWinnersAlert(props: NewWinnersAlertProps) {
  return (
    <AlertDialog open={props.isOpenWinners} onOpenChange={props.setIsOpenWinners}>
      <AlertDialogContent className={`bg-primary/25 rounded-md border-none ${props.className || ''} lg:max-w-screen-lg overflow-y-auto max-h-screen`}>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <div className="w-full flex flex-col gap-y-4">
              <div className="w-full flex items-center justify-center gap-x-2">
                <span className="text-xl text-primary-foreground font-bold">VENCEDORES DO {props.newWinners.some(w => w.prizeType === winner_prize_type.SECOND) ? '2º' : '1º'} PRÊMIO</span>
                <img src={`/images/misc/trophies/${props.newWinners.some(w => w.prizeType === winner_prize_type.SECOND) ? 'silver' : 'bronze'}.png`} className="size-8 rotate-[25deg] skeleton-hidden" />
              </div>

              {props.newWinners.map((w, i) => (
                <div key={i} className="w-full flex flex-col bg-primary rounded-lg border-2 border-primary">
                  <div className="w-full text-center bg-primary-text rounded-t-md border-b-2 border-b-primary">
                    <span className="text-lg text-primary-foreground">{w.user?.name}</span>
                  </div>

                  {/* FIRST TICKET ROW */}
                  <div className="w-full flex">
                    {w.ticket.numbers.slice(0, 5).map((n, j) => (
                      <div key={j} className={cn('flex flex-1 items-center justify-center text-center border border-muted', getNumberClasses(props.game.balls, String(n), props.game.status), j == 0 && 'border-l-none', j == 4 && 'border-r-none')}>
                        <span className="text-md text-primary-foreground">{n}</span>
                      </div>
                    ))}
                  </div>

                  {/* SECOND TICKET ROW */}
                  <div className="w-full flex">
                    {w.ticket.numbers.slice(5, 10).map((n, j) => (
                      <div key={j} className={cn('flex flex-1 items-center justify-center text-center border border-muted', getNumberClasses(props.game.balls, String(n), props.game.status))}>
                        <span className="text-md text-primary-foreground">{n}</span>
                      </div>
                    ))}
                  </div>

                  {/* THIRD TICKET ROW */}
                  <div className="w-full flex">
                    {w.ticket.numbers.slice(10).map((n, j) => (
                      <div key={j} className={cn('flex flex-1 items-center justify-center text-center border border-muted', getNumberClasses(props.game.balls, String(n), props.game.status))}>
                        <span className="text-md text-primary-foreground">{n}</span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full text-center bg-primary-text rounded-b-md border-t-2 border-t-primary">
                    <span className="text-lg text-primary-foreground">{String(w.ticket?.id).padStart(6, '0')}</span>
                  </div>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
