// packages
import { Minus, Plus } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { HomeBalanceCard } from "@/components/cards/home-balance-card";

export function HomeTimerContext() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
      {/* TIMER / INFOS / PRIZES */}
      <div className="bg-foreground flex flex-col gap-y-4 rounded-lg border border-4 border-primary p-4 w-full">
        {/* TIMER */}
        <div className="flex gap-x-2 w-full">
          <div className="rounded-lg border border-2 border-primary-text p-4">
            <span className="font-bold text-primary-text text-6xl">0</span>
          </div>

          <div className="rounded-lg border border-2 border-primary-text p-4">
            <span className="font-bold text-primary-text text-6xl">0</span>
          </div>

          <div className="rounded-lg p-4">
            <span className="font-bold text-primary-text text-6xl">:</span>
          </div>

          <div className="rounded-lg border border-2 border-primary-text p-4">
            <span className="font-bold text-primary-text text-6xl">0</span>
          </div>

          <div className="rounded-lg border border-2 border-primary-text p-4">
            <span className="font-bold text-primary-text text-6xl">0</span>
          </div>
        </div>

        {/* INFOS  SECTION */}
        <div className="flex w-full justify-between items-center border border-2 border-primary-text rounded-md py-2">
          <div className="flex flex-col items-center justify-center gap-1 flex-grow">
            <span className="font-semibold text-primary-text text-md">Sorteio</span>
            <span className="font-semibold text-background text-sm">003705</span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-primary-text gap-1 flex-grow">
            <span className="font-semibold text-primary-text text-md">Doação</span>
            <span className="font-semibold text-background text-sm">R$ 0,10</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 flex-grow">
            <span className="font-semibold text-primary-text text-md">Hora</span>
            <span className="font-semibold text-background text-sm">22/12 16:20</span>
          </div>
        </div>

        {/* PRIZES SECTION */}
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex w-full justify-between items-center bg-primary rounded-md p-3">
            <div className="flex items-center gap-x-4">
              <span className="text-xl text-primary-foreground font-bold">1º PRÊMIO</span>
              <img src="/images/misc/trophies/bronze.png" className="size-8 rotate-[25deg]" />
            </div>

            <span className="text-xl text-primary-foreground font-bold">R$ 20,00</span>
          </div>

          <div className="flex w-full justify-between items-center bg-primary rounded-md p-3">
            <div className="flex items-center gap-x-4">
              <span className="text-xl text-primary-foreground font-bold">2º PRÊMIO</span>
              <img src="/images/misc/trophies/silver.png" className="size-8 rotate-[25deg]" />
            </div>

            <span className="text-xl text-primary-foreground font-bold">R$ 30,00</span>
          </div>

          <div className="flex w-full justify-between items-center bg-primary rounded-md p-3 smalltobig">
            <div className="flex items-center gap-x-4">
              <span className="text-xl text-primary-foreground font-bold">3º PRÊMIO</span>
              <img src="/images/misc/trophies/gold.png" className="size-8 rotate-[25deg]" />
            </div>

            <span className="text-xl text-primary-foreground font-bold">R$ 60,00</span>
          </div>
        </div>
      </div>

      {/* BUY */}
      <div className="bg-foreground flex flex-col gap-y-2 rounded-lg p-4 w-full">
        <span className="text-success font-bold text-md">Saldo: R$ 0,00</span>

        {/* AMOUNT SECTION */}
        <div className="flex w-full justify-between items-center gap-x-2">
          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">1</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">5</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">10</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">20</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">30</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">40</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">50</span>
          </Button>

          <Button variant="default" className="flex-grow rounded-lg py-1.5 px-2" size="xs">
            <span className="font-semibold text-primary-foreground text-md">100</span>
          </Button>
        </div>

        {/* FORM SECTION */}
        <div className="flex flex-nowrap w-full justify-between items-center gap-x-4">
          <div className="flex items-center w-5/12 h-full">
            <Button variant="default" className="h-full flex items-center justify-center rounded-none">
              <Minus className="size-4 text-primary-foreground" />
            </Button>

            <div className="flex items-center justify-center flex-grow border-y border-primary max-h-full py-[3px]">
              <span className="text-md text-background font-semibold">1</span>
            </div>

            <Button variant="default" className="h-full flex items-center justify-center rounded-none">
              <Plus className="size-4 text-primary-foreground" />
            </Button>
          </div>

          <div className="flex items-center w-7/12 h-full">
            <div className="flex items-center justify-center flex-grow border-l border-y border-primary max-h-full py-[3px]">
              <span className="text-md text-background font-semibold">R$ 0,10</span>
            </div>

            <Button variant="default" className="h-full flex items-center justify-center rounded-none text-xs">
              Comprar
            </Button>
          </div>
        </div>
      </div>

      {/* BALANCE */}
      <HomeBalanceCard />

      <div className="bg-primary/50 px-8 py-16 flex items-center justify-center rounded-lg w-full">
        <span className="text-2xl text-primary-foreground">BANNER AQUI</span>
      </div>
    </div>
  );
}
