// packages
import { ColumnDef } from '@tanstack/react-table'

// components
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { CustomDataTable } from '@/components/table/custom-data-table'
import { GameTicketsSection } from '@/components/sections/game-tickets-section'

export function HomeGameContext() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'coupon',
      header: 'CUPOM',
      cell: ({ row }) => <div>{Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}</div>
    },
    {
      accessorKey: 'donater',
      header: 'DOADOR',
      cell: ({ row }) => <div>Francisca</div>
    },
    {
      accessorKey: 'remaining',
      header: 'FALTAM',
      cell: ({ row }) => (
        <div className="flex gap-x-1">
          <div className="flex items-center justify-center p-2 rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded-md bg-primary">
            <span className="font-bold text-sm text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
          </div>
          <div className="flex items-center justify-center p-2 rounded-md bg-muted">
            <span className="font-bold text-sm text-accent">&nbsp;</span>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
      {/* PRIZES */}
      <div className="flex gap-x-4 w-full">
        <div className="flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 w-1/3 bg-primary/50">
          <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Prêmio 1</span>
          <span className="text-primary-foreground rounded-lg text-xs">R$ 20,00</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-y-2 rounded-md p-2 w-1/3 bg-accent">
          <span className="w-full text-center text-primary-foreground rounded-lg text-xs font-bold">Prêmio 2</span>
          <span className="text-primary-foreground rounded-lg text-xs">R$ 30,00</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-y-2 rounded-md p-2 w-1/3 bg-accent">
          <span className="w-full text-center text-primary-foreground rounded-lg text-xs font-bold">Prêmio 3</span>
          <span className="text-primary-foreground rounded-lg text-xs">R$ 60,00</span>
        </div>
      </div>

      {/* BALL */}
      <div className="flex items-center justify-between gap-x-4 w-full bg-accent/50 rounded-md">
        {/* CARDS */}
        <div className="flex flex-col gap-y-2 h-full flex-grow">
          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Sorteio</span>
            <span className="text-primary-foreground rounded-lg text-xs">003702</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Doação</span>
            <span className="text-primary-foreground rounded-lg text-xs">R$ 0,10</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Data</span>
            <span className="text-primary-foreground rounded-lg text-xs">22/12/2024</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-y-2 rounded-md border border-primary-text p-2 bg-primary/50">
            <span className="w-full text-center bg-primary-text text-primary-foreground rounded-lg text-xs font-bold">Hora</span>
            <span className="text-primary-foreground rounded-lg text-xs">15:50:00</span>
          </div>
        </div>

        {/* BALL */}
        <div className="flex items-center justify-center h-full flex-grow">
          <img src="/images/misc/bolas/bola-66.png" className="size-48" />
        </div>

        {/* BALLS */}
        <div className="flex flex-col items-center gap-y-4 h-full flex-grow">
          <Avatar className="size-16 border-2 border-primary-foreground rounded-full">
            <AvatarImage src="/images/misc/bolas/bola-vazia.png" />
          </Avatar>

          <Avatar className="size-12 border-2 border-primary-foreground rounded-full">
            <AvatarImage src="/images/misc/bolas/bola-vazia.png" />
          </Avatar>

          <Avatar className="size-9 border-2 border-primary-foreground rounded-full">
            <AvatarImage src="/images/misc/bolas/bola-vazia.png" />
          </Avatar>
        </div>
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-y-2 w-full items-end">
        <span className="text-primary-text text-sm font-bold">ORDEM 1</span>

        <div className="flex flex-col gap-y-[1.5px] py-2 px-1 bg-primary/50 rounded-lg w-full">
          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 1}</span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 16}</span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 31}</span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 46}</span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 61}</span>
            ))}
          </div>

          <div className="flex justify-end w-full gap-x-[1px]">
            {new Array(15).fill(' ').map((_, i) => (
              <span className="bg-accent px-2 py-1 rounded-sm text-muted-foreground text-[8px] font-bold text-center w-[6.66%]">{i + 76}</span>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full bg-primary rounded-lg p-1 flex flex-wrap">
        {/* <CustomDataTable columns={columns} data={new Array(8).fill(' ')} hideFilterInput={true} /> */}
        <div className="flex w-full">
          <span className="w-3/12 text-center font-bold text-sm text-primary-foreground">CUPOM</span>
          <span className="w-4/12 text-center font-bold text-sm text-primary-foreground">DOADOR</span>
          <span className="w-5/12 text-center font-bold text-sm text-primary-foreground">FALTAM</span>
        </div>

        <div className="flex w-full gap-x-0.5">
          <div className="flex flex-col gap-y-0.5 flex-grow h-full">
            {new Array(10).fill(' ').map((_, i) => (
              <div className="bg-foreground rounded-md px-4 py-1 w-full flex items-center justify-center h-full">
                <span className="text-xs font-bold text-red-500">{Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-0.5 flex-grow h-full">
            {new Array(10).fill(' ').map((_, i) => (
              <div className="bg-foreground rounded-md px-4 py-1 w-full flex items-center justify-center h-full">
                <span className="text-xs font-bold text-background">Francisca Maria</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-y-0.5 w-5/12 h-full">
            {new Array(10).fill(' ').map((_, i) => (
              <div className="flex gap-x-1">
                <div className="flex items-center justify-center p-2 rounded-md bg-primary-text w-[20%]">
                  <span className="font-bold text-xs text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
                </div>
                <div className="flex items-center justify-center p-2 rounded-md bg-primary-text w-[20%]">
                  <span className="font-bold text-xs text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
                </div>
                <div className="flex items-center justify-center p-2 rounded-md bg-primary-text w-[20%]">
                  <span className="font-bold text-xs text-primary-foreground">{Math.floor(Math.random() * (99 - 1 + 1)) + 1}</span>
                </div>
                <div className="flex items-center justify-center p-2 rounded-md bg-muted-foreground w-[20%]">
                  <span className="font-bold text-xs text-accent">&nbsp;</span>
                </div>
                <div className="flex items-center justify-center p-2 rounded-md bg-muted-foreground w-[20%]">
                  <span className="font-bold text-xs text-accent">&nbsp;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GameTicketsSection />
    </div>
  )
}
