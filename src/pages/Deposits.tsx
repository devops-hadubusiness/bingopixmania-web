// packages
import { useState } from "react";
import { format } from "date-fns-tz";
import { DollarSign } from "lucide-react";

// components
import { Avatar } from "@/components/ui/avatar";

// utils
import { timeZone } from "@/utils/dates-util";
import { formatBRL } from '@/utils/currencies-util'

export default function DepositsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: puxar da API
  const [deposits, setDeposits] = useState<any[]>([
    {
      value: 10,
      status: "PIX pago",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
    {
      value: 5,
      status: "AGUARDANDO PAGAMENTO, CLIQUE PARA PAGAR",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
  ]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        {deposits.map((deposit, i) => (
          <div className="rounded-lg bg-accent p-4 flex flex-col gap-y-4 w-full">
            <div className="flex w-full gap-x-4 items-center">
              <div className="flex items-center justify-center h-full">
                <Avatar className={`size-10 rounded-full flex items-center justify-center ${i % 2 == 0 ? "bg-success/30 text-success" : "bg-yellow-500/30 text-yellow-500"}`}>
                  <DollarSign />
                </Avatar>
              </div>

              <div className="flex flex-col">
                <span className="text-primary-foreground font-bold text-sm">{deposit.createdAt}</span>
                <span className="text-muted-foreground text-md">Status: {deposit.status}</span>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">{formatBRL(deposit.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
