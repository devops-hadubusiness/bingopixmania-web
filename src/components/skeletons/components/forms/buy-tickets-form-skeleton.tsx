// packages
import { Check, Minus, Plus } from 'lucide-react'

// components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GameTicketsSection } from '@/components/sections/game-tickets-section'

export function BuyTicketsFormSkeleton() {
  return (
    <>
      <div className="bg-foreground flex flex-col gap-y-2 rounded-lg p-4 w-full">
        <span className="text-success font-bold text-md max-w-[60%] skeleton">&nbsp;</span>

        {/* AMOUNT SECTION */}
        <div className="flex w-full justify-between items-center gap-x-2">
          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>

          <Button type="button" variant="default" className="flex-grow rounded-lg py-1.5 px-2 skeleton" size="xs">
            <span className="font-semibold text-primary-foreground text-md not-skeleton">&nbsp;</span>
          </Button>
        </div>

        {/* FORM SECTION */}
        <div className="flex flex-nowrap w-full justify-between items-center gap-x-4 skeleton-no-bg">
          <div className="flex items-center w-1/2 h-full">
            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none">
              <Minus className="size-4 text-primary-foreground" />
            </Button>

            <Input className="!text-center text-md text-background font-semibold rounded-none !h-8 !bg-transparent !border-x-none !border-y !border-muted-foreground" />

            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none">
              <Plus className="size-4 text-primary-foreground" />
            </Button>
          </div>

          <div className="flex items-center w-1/2 h-full">
            <div className="flex items-center justify-center flex-grow border-l border-y border-muted-foreground max-h-full py-[3px] hover:cursor-not-allowed">
              <span className="text-md text-background font-semibold text-muted-foreground">&nbsp;</span>
            </div>

            <Button type="button" variant="default" className="h-full flex items-center justify-center rounded-none text-xs">
              <Check className="size-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* TICKETS */}
      <GameTicketsSection parentLoading={true} />
    </>
  )
}
