// packages
import { withMask } from "use-mask-input";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IndicationsPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        <div className="bg-success/10 p-4 rounded-lg w-full">
          <span className="text-md text-success">
            <span className="font-bold">Atenção!</span>
            Indique um amigo e receba
            <span className="font-bold">&nbsp;R$ 15,00&nbsp;</span>
            em bônus assim que ele fizer a primeira recarga com depósito mínimo de
            <span className="font-bold">&nbsp;R$ 5,00.</span>
          </span>
        </div>

        <div className="w-full flex gap-x-2">
          <div className="flex flex-col items-center justify-center gap-y-2 bg-accent p-4 rounded-lg flex-grow">
            <span className="text-lg font-bold text-primary-foreground">CADASTROS</span>
            <span className="text-lg font-bold text-primary-foreground">1</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-y-2 bg-accent p-4 rounded-lg flex-grow">
            <span className="text-lg font-bold text-primary-foreground">FINALIZADOS</span>
            <span className="text-lg font-bold text-primary-foreground">0</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-y-2 bg-accent p-4 rounded-lg">
          <span className="text-lg font-bold text-primary-foreground">TOTAL EM INDICAÇÕES</span>
          <span className="text-2xl font-bold text-primary-text">R$ 0,00</span>
        </div>

        <Button variant="default" className="bg-red-500 hover:bg-red-500 hover:brightness-125 w-full font-bold">
          CLIQUE AQUI PARA COPIAR SEU LINK
        </Button>
      </div>
    </div>
  );
}
