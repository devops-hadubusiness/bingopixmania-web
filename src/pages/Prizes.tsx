// packages
import { withMask } from "use-mask-input";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PrizesPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        <div className="bg-success/10 p-4 rounded-lg w-full">
          <span className="text-md text-success">
            <span className="font-bold">Saldo triplicado!&nbsp;</span>
            Adicione seus prêmios ao saldo e ganhe
            <span className="font-bold">&nbsp;bônus de 200% 💰</span>
          </span>
        </div>

        <div className="bg-foreground p-4 rounded-lg w-full flex flex-col items-center justify-center gap-y-2">
          <div className="flex justify-between items-center">
            <div className="h-full bg-muted-foreground flex items-center justify-center rounded-l-md p-1">
              <span className="text-background text-2xl font-bold">R$</span>
            </div>

            <div className="h-full flex items-center justify-center border-b rounded-none">
              <Input ref={withMask("brl-currency")} className="dark:bg-zinc-200/80 !text-center dark:text-background font-bold text-2xl border-none" type="number" disabled />
            </div>
          </div>

          <span className="text-sm text-gray-500">Total disponível para resgate: R$ 0,00</span>

          <div className="flex gap-x-2 w-full">
            <Button variant="default" className="flex-grow font-bold" disabled>
              SACAR
            </Button>

            <Button variant="default" className="bg-success hover:bg-success hover:brightness-125 flex-grow font-bold" disabled>
              ADICIONAR AO SALDO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
