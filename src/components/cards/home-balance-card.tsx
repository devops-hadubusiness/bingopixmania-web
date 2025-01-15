export function HomeBalanceCard() {
  return (
    <div className="bg-primary flex items-center py-2 rounded-lg w-full">
      <div className="w-1/2 flex justify-end gap-x-2 border-r border-primary-foreground pr-2">
        <span className="text-lg text-primary-foreground font-bold">SALDO</span>
        <span className="text-lg text-success font-bold">R$ 0,00</span>
      </div>

      <div className="w-1/2 flex gap-x-2 border-l border-primary-foreground pl-2">
        <span className="text-lg text-primary-foreground font-bold">COMPRADAS</span>
        <span className="text-lg text-success font-bold">0</span>
      </div>
    </div>
  );
}
