// packages
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-hidden flex flex-col items-center justify-center text-center gap-y-2">
      <h1 className="text-[170px] text-muted-foreground/25">404</h1>
      <h3 className="text-3xl text-muted-foreground">Ops ...</h3>
      <span className="text-lg text-muted-foreground">A página não foi encontrada.</span>
      <a href="/" className="text-sm text-white bg-primary px-12 py-2 rounded-md flex items-center gap-x-2">
        <ChevronLeft className="size-4" />
        Voltar
      </a>
    </div>
  );
}
