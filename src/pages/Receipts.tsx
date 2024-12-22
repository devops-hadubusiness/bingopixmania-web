// packages
import { useState } from "react";
import { format } from "date-fns-tz";
import { CornerRightUp, CornerRightDown } from "lucide-react";

// components
import { Avatar } from "@/components/ui/avatar";

// utils
import { timeZone } from "@/utils/dates-util";
import { formatToPrice } from "@/utils/strings-util";

export default function ReceiptsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: puxar da API
  const [receipts, setReceipts] = useState<any[]>([
    {
      type: "BUY",
      value: 10,
      title: "Compra de Cartelas",
      description: "Compra de 100 cartelas para o sorteio 3719",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
    {
      type: "BUY",
      value: 10,
      title: "Compra de Cartelas",
      description: "Compra de 100 cartelas para o sorteio 3719",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
    {
      type: "DEPOSIT",
      value: 10,
      title: "Depósito de bônus",
      description: "Recebimento de bônus de depósito pago.",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
    {
      type: "DEPOSIT",
      value: 10,
      title: "Depósito de saldo",
      description: "Recebimento de depósito pago.",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
    {
      type: "DEPOSIT",
      value: 15,
      title: "Bônus de primeiro depósito",
      description: "Recebimento de bônus de primeiro depósito.",
      createdAt: format(new Date(), "dd/MM/yyyy HH:mm", { timeZone }),
    },
  ]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 max-w-[475px] min-w-[475px]">
        {receipts.map((receipt, i) => (
          <div className="rounded-lg bg-accent p-4 flex flex-col gap-y-4 w-full">
            <div className="flex w-full gap-x-4 items-center">
              <div className="flex items-center justify-center h-full">
                <Avatar className={`size-10 rounded-full flex items-center justify-center ${receipt.type === "BUY" ? "bg-red-500/30 text-red-500" : "bg-success/30 text-success"}`}>{receipt.type === "BUY" ? <CornerRightUp /> : <CornerRightDown />}</Avatar>
              </div>

              <div className="flex flex-col">
                <span className={`font-bold text-2xl ${receipt.type === "BUY" ? "text-red-500" : "text-success"}`}>{formatToPrice(receipt.value)}</span>
                <span className="text-primary-foreground font-bold text-md">{receipt.title}</span>
                <span className="text-muted-foreground text-sm">{receipt.description}</span>
                <span className="text-muted-foreground text-sm">{receipt.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
