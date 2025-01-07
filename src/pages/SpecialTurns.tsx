// packages
import { useState } from "react";
import { format } from "date-fns-tz";
import { ShoppingCart, ReceiptText } from "lucide-react";

// components
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HomeTimerContext } from "@/components/contexts/home-timer-context";
import { HomeGameContext } from "@/components/contexts/home-game-context";

// hooks
import { useToast } from "@/hooks/use-toast";

// utils
import { timeZone } from "@/utils/dates-util";
import { formatToPrice } from "@/utils/strings-util";

export default function TurnsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: puxar da API
  const [turns, setTurns] = useState<any[]>(
    new Array(20).fill({
      id: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
      value: 0.5,
      prizes: [200, 300, 5000],
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    })
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        {turns.map((turn, i) => (
          <div className="rounded-lg bg-accent p-4 flex flex-col gap-y-4 w-full">
            <div className="flex w-full justify-between">
              <span className="text-muted-foreground font-semibold text-xs">{turn.createdAt}</span>

              <span className={`font-bold text-sm ${i % 2 === 0 ? "text-success" : "text-red-500"}`}>{i % 2 === 0 ? "Vendas Abertas" : "Finalizado"}</span>
            </div>

            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <span className={`font-bold text-md ${i % 2 === 0 ? "text-success" : "text-red-500"}`}>PARTIDA #{turn.id}</span>
                <span className="text-primary-foreground font-bold text-md">VALOR {formatToPrice(turn.value)}</span>
              </div>

              <div className="flex items-center justify-center h-full">
                <Avatar className={`size-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-success" : "bg-red-500"}`}>{i % 2 === 0 ? <ShoppingCart /> : <ReceiptText />}</Avatar>
              </div>
            </div>

            <div className="flex w-full justify-between items-center">
              {turn.prizes.map((prize, j) => (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <span className="text-sm text-primary-foreground font-semibold">Prêmio {j + 1}</span>
                  <span className="text-md text-primary-foreground font-bold">{formatToPrice(prize)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
