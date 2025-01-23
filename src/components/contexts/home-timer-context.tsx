// components
import { HomeTimer } from '@/components/timers/home-timer'
import { HomeNextGameSection } from '@/components/sections/home-next-game-section'
import { BuyTicketsForm } from '@/components/forms/buy-tickets-form'
import { BuyTicketsFormSkeleton } from '@/components/skeletons/components/forms/buy-tickets-form-skeleton'

// entities
import { ConfigProps } from '@/entities/config/config'
import { GameProps } from '@/entities/game/game'

// lib
import { cn } from '@/lib/utils'

// types
type HomeTimerContextProps = {
  parentLoading: boolean
  configs?: ConfigProps
  nextGame?: GameProps
}

// variables
const loc = `@/components/contexts/home-timer-context`

export function HomeTimerContext({ parentLoading, configs, nextGame }: HomeTimerContextProps) {

  return (
    <div className={cn('flex flex-col items-center justify-center gap-y-4 p-8 smAndDown:min-w-screen smAndDown:max-w-screen mdAndUp:max-w-[475px] mdAndUp:min-w-[475px]')}>
      {/* TIMER / NEXT GAME */}
      <div className="bg-foreground flex flex-col gap-y-4 rounded-lg border border-4 border-primary p-4 w-full">
        {/* TIMER */}
        <HomeTimer parentLoading={parentLoading} configs={configs} nextGame={nextGame} />

        {/* NEXT GAME */}
        <HomeNextGameSection parentLoading={parentLoading} nextGame={nextGame} />
      </div>

      {/* BUY */}
      {(parentLoading || !configs || !nextGame) && <BuyTicketsFormSkeleton />}
      {!parentLoading && configs && nextGame && <BuyTicketsForm parentLoading={parentLoading} configs={configs} game={nextGame} />}
    </div>
  )
}
