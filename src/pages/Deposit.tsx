// packages
import { withMask } from "use-mask-input";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DepositPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        <div className="bg-primary/50 px-8 py-16 flex items-center justify-center rounded-lg w-full">
          <span className="text-2xl text-primary-foreground">BANNER AQUI</span>
        </div>

        <div className="bg-success/10 p-4 rounded-lg w-full">
          <span className="text-lg text-success font-bold">Recarga Ativada!</span>

          <div className="flex flex-col w-full mt-4">
            <span className="text-md text-success">
              De R$ 3,00 a R$ 24,00: Ganhe <span className="font-bold">100%</span> de bônus!
            </span>
            <span className="text-md text-success">
              De R$ 25,00 a R$ 49,00: Ganhe <span className="font-bold">150%</span> de bônus!
            </span>
            <span className="text-md text-success">
              Acima de R$ 50,00: Ganhe <span className="font-bold">200%</span> de bônus!
            </span>
          </div>
        </div>

        <div className="bg-foreground p-4 rounded-lg w-full flex flex-col items-center justify-center gap-y-2">
          <span className="text-sm text-gray-500">Digite o valor da recarga</span>

          <div className="flex justify-between items-center">
            <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
              <span className="text-background text-2xl font-bold">R$</span>
            </div>

            <div className="h-full flex items-center justify-center border-b rounded-none">
              <Input ref={withMask("brl-currency")} className="dark:bg-zinc-200/80 !text-center dark:text-background font-bold text-2xl border-none" type="number" />
            </div>
          </div>

          <span className="text-sm text-gray-500">Valor mínimo para depósito: R$ 3,00</span>

          <div className="flex w-full gap-x-2">
            <div className="bg-primary border-primary-text flex items-center justify-center rounded-md p-1 flex-grow">
              <span className="text-primary-foreground text-sm font-bold">R$ 10,00</span>
            </div>

            <div className="bg-primary border-primary-text flex items-center justify-center rounded-md p-1 flex-grow">
              <span className="text-primary-foreground text-sm font-bold">R$ 30,00</span>
            </div>

            <div className="bg-primary border-primary-text flex items-center justify-center rounded-md p-1 flex-grow">
              <span className="text-primary-foreground text-sm font-bold">R$ 50,00</span>
            </div>

            <div className="bg-primary border-primary-text flex items-center justify-center rounded-md p-1 flex-grow">
              <span className="text-primary-foreground text-sm font-bold">R$ 100,00</span>
            </div>
          </div>

          <Button variant="default" className="bg-success hover:bg-success hover:brightness-125 w-full font-bold">
            EFETUAR PAGAMENTO
          </Button>
        </div>
      </div>
    </div>
  );
}
