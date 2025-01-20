// components
import { HomeTimer } from '@/components/timers/home-timer'
import { HomeNextGameSection } from '@/components/sections/home-next-game-section'
import { HomeBuyTicketsSection } from '@/components/sections/home-buy-tickets-section'

// entities
import { ConfigProps } from '@/entities/config/config'

// types
type HomeTimerContextProps = {
  parentLoading: boolean
  configs?: ConfigProps
}

// variables
const loc = `@/components/contexts/home-timer-context`

export function HomeTimerContext({ parentLoading, configs }: HomeTimerContextProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
      {/* TIMER / NEXT GAME */}
      <div className="bg-foreground flex flex-col gap-y-4 rounded-lg border border-4 border-primary p-4 w-full">
        {/* TIMER */}
        <HomeTimer parentLoading={parentLoading} configs={configs} />

        {/* NEXT GAME */}
        <HomeNextGameSection parentLoading={parentLoading} />
      </div>

      {/* BUY */}
      <HomeBuyTicketsSection parentLoading={parentLoading} configs={configs} />
    </div>
  )
}
