// packages
import { useState } from "react";

// components
import { Button } from "@/components/ui/button";
import { HomeTimerContext } from "@/components/contexts/home-timer-context";
import { HomeGameContext } from "@/components/contexts/home-game-context";

// hooks
import { useToast } from "@/hooks/use-toast";

// types
type ContextProps = "TIMER" | "GAME";

export default function HomePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [context, setContext] = useState<ContextProps>("TIMER");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 p-8 relative">
      <Button variant="default" className="absolute top-16 left-0" onClick={() => setContext(context === "GAME" ? "TIMER" : "GAME")}>
        {context === "TIMER" ? "Simular" : "Voltar"}
      </Button>

      {context === "TIMER" && <HomeTimerContext />}
      {context === "GAME" && <HomeGameContext />}
    </div>
  );
}
