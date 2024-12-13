// packages
import { Check } from "lucide-react";

// type
type StepperCounterProps = {
  step: number;
};

export function StepperCounter({ step }: StepperCounterProps) {
  return (
    <div className="flex flex-col w-full relative">
      <div className="xxsAndDown:hidden flex flex-row w-full items-center justify-between absolute top-[calc(33.3%_-_4px)]">
        <div className={`absolute top-[2px] left-10 w-[calc(33.3%_-_52px)] h-1 z-0 ${step > 1 ? "bg-primary" : "dark:bg-gray-500 bg-primary/25"}`} />
        <div className={`absolute top-[2px] left-[calc(33.3%_+_26px)] w-[calc(33.3%_-_52px)] h-1 z-0  ${step > 2 ? "bg-primary" : "dark:bg-gray-500 bg-primary/25"}`} />
        <div className={`absolute top-[2px] left-[calc(66.6%_+_14px)] w-[calc(33.3%_-_52px)] h-1 z-0 ${step > 3 ? "bg-primary" : "dark:bg-gray-500 bg-primary/25"}`} />
      </div>

      <div className="flex flex-row w-full items-center justify-between">
        <div className={`z-10 rounded-full size-10 text-lg font-semibold border dark:border-gray-500 border-primary/25 flex items-center justify-center ${step >= 1 ? "bg-primary text-white dark:border-0" : "bg-primary/15 dark:bg-accent text-primary dark:text-accent-foreground"}`}>{step > 1 ? <Check className="size-4" /> : 1}</div>

        <div className={`rounded-full size-10 text-lg font-semibold border dark:border-gray-500 border-primary/25 flex items-center justify-center ${step >= 2 ? 'bg-primary text-white dark:border-0' : "bg-primary/15 dark:bg-accent text-primary dark:text-accent-foreground"}`}>{step > 2 ? <Check className="size-4" /> : 2}</div>

        <div className={`rounded-full size-10 text-lg font-semibold border dark:border-gray-500 border-primary/25 flex items-center justify-center ${step >= 3 ? 'bg-primary text-white dark:border-0' : "bg-primary/15 dark:bg-accent text-primary dark:text-accent-foreground"}`}>{step > 3 ? <Check className="size-4" /> : 3}</div>

        <div className={`rounded-full size-10 text-lg font-semibold border dark:border-gray-500 border-primary/25 flex items-center justify-center ${step >= 4 ? 'bg-primary text-white dark:border-0' : "bg-primary/15 dark:bg-accent text-primary dark:text-accent-foreground"}`}>4</div>
      </div>

      <div className="xxsAndDown:hidden flex flex-row w-full items-center justify-between relative h-4">
        <span className={`absolute top-1 text-sm ${step >= 1 ? "text-primary font-semibold" : "text-foreground"}`}>Contatos</span>
        <span className={`absolute top-1 left-[calc(33.3%_-_8px)] text-sm ${step == 2 ? "text-primary font-semibold" : step > 2 ? "text-primary" : "dark:text-white"}`}>Funil</span>
        <span className={`absolute top-1 right-[calc(33.3%_-_20px)] text-sm ${step == 3 ? "text-primary font-semibold" : step > 3 ? "text-primary" : "dark:text-white"}`}>Sessões</span>
        <span className={`absolute top-1 right-0 text-sm ${step == 4 ? "text-primary font-semibold" : "dark:text-white"}`}>Resumo</span>
      </div>
    </div>
  );
}
