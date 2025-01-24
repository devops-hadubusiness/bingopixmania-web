// packages
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// components
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { BuyTicketsFormSkeleton } from '../skeletons/components/forms/buy-tickets-form-skeleton'
import { BuyTicketsForm } from '@/components/forms/buy-tickets-form'
import { Button } from '@/components/ui/button'

// entities
import { TicketProps } from '@/entities/ticket/ticket'
import { GameProps } from '@/entities/game/game'

// hooks
import { useConfigs } from '@/hooks/use-configs'

// lib
import { cn } from '@/lib/utils'

// store
import { useAuthStore } from '@/store/auth'
import { AlertDialogCancel, AlertDialogTitle } from '@radix-ui/react-alert-dialog'

// types
type BuyTicketsAlertProps = {
  open: boolean
  game: GameProps
  cb: (boughtTickets: TicketProps[]) => void
}

// variables
const loc = 'components/dialogs/buy-tickets-dialog'

export function BuyTicketsAlert({ open, game, cb }: BuyTicketsAlertProps) {
  const { user } = useAuthStore()
  const { configs, loading: isLoadingConfigs } = useConfigs(user?.ref)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(open)

  useEffect(() => {
    setIsLoading(isLoadingConfigs)
  }, [isLoadingConfigs])

  useEffect(() => {
    document.body.style.pointerEvents = 'auto'
  }, [document.body.style.pointerEvents])

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false)
        cb([])
      }}
    >
      <>
        {game.tickets?.length >= 10 && (
          <div className="flex w-full max-w-lg lg:max-w-screen-lg justify-between w-screen fixed translate-x-[-50%] translate-y-[-50%] left-1/2 px-4 top-0 pt-14 pb-2 z-[1000] bg-background rounded-b-lg">
            <span className="text-md font-bold text-foreground">Comprar Cartelas</span>

            <Button
              variant="ghost"
              size="sm"
              className="z-[1000] hover:brightness-125 hover:cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                cb([])
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        <AlertDialogContent className={cn('rounded-md border-none lg:max-w-screen-lg max-h-screen overflow-y-auto', game.tickets?.length >= 10 && 'pt-12')}>
          {game.tickets?.length < 10 && (
            <AlertDialogHeader className="relative">
              <AlertDialogTitle className="self-start">Comprar Cartelas</AlertDialogTitle>

              <AlertDialogCancel className="absolute translate-y-[-50%] top-1 right-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="z-[1000] hover:brightness-125 hover:cursor-pointer"
                  onClick={() => {
                    setIsOpen(false)
                    cb([])
                  }}
                >
                  <X className="size-4" />
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>
          )}
          <AlertDialogDescription className="flex flex-col gap-y-4">{isLoading ? <BuyTicketsFormSkeleton /> : <BuyTicketsForm parentLoading={isLoading} configs={configs} game={game} onBoughtTickets={cb} />}</AlertDialogDescription>
        </AlertDialogContent>
      </>
    </AlertDialog>
  )
}
