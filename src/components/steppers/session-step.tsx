// packages
import { useEffect, useState } from "react";
import { Check, ReplaceAll } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// components
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SessionCards from "@/components/cards/session-cards";

// entities
import { session_status, SessionProps } from "@/entities/session/session";

// store
import { useStore } from "@/store/store";

// entities
const createShotsSchema = z.object({
  shotsCount: z.coerce.number({ message: "Informe a quantidade de disparos." }).int({ message: "Quantidade inválida." }).min(0, { message: "Mínimo: 0" }),
  sessionId: z.coerce.number({ message: "Informe o id da sessão." }).int({ message: "Id da sessão inválida." }).positive({ message: "Id da sessão inválida." }),
});
type CreateShotsSchema = z.infer<typeof createShotsSchema>;

type SessionsStepProps = {
  onShotsDistributed: (shots: { sessionId: number; shots: number }[]) => void;
  contactsLength: number;
};

export function SessionsStep({ onShotsDistributed, contactsLength }: SessionsStepProps) {
  const store = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableShots, setAvailableShots] = useState(contactsLength); //TODO: colocar um input para definir quantos disparos na campanha
  const [selectedSessionId, setSelectedSessionId] = useState<number | undefined>();
  const [shotsPerSession, setShotsPerSession] = useState<{
    [key: number]: number;
  }>({});
  // const [currentShots, setCurrentShots] = useState<number>(0)
  const [sessions, setSessions] = useState<SessionProps[]>([]);
  const [sessionsWithShots, setSessionsWithShots] = useState<number[]>([]);

  const availableSessionsStatus = [session_status.ACTIVE, session_status.BUSY, session_status.PAUSED]

  const form = useForm<CreateShotsSchema>({
    resolver: zodResolver(createShotsSchema),
  });

  useEffect(() => {
    if (availableShots === 0 && Object.keys(shotsPerSession).length > 0) {
      const shotsArray = Object.entries(shotsPerSession).map(([sessionId, shots]) => ({
        sessionId: Number(sessionId),
        shots,
      }));
      onShotsDistributed(shotsArray);
    }
  }, [availableShots, shotsPerSession]);

  function _handleOpenModal(sessionId: number, shotsCount: number) {
    setSelectedSessionId(sessionId);
    form.setValue("sessionId", sessionId);
    form.setValue("shotsCount", shotsCount);
    setIsDialogOpen(true);
  }

  function _handleSave(data: CreateShotsSchema) {
    if (data.shotsCount > availableShots + (shotsPerSession[data.sessionId] || 0)) {
      return;
    }

    setShotsPerSession((prev) => ({
      ...prev,
      [data.sessionId]: data.shotsCount,
    }));
    setAvailableShots((prev) => prev + (shotsPerSession[data.sessionId] || 0) - data.shotsCount);
    setIsDialogOpen(false);
    form.reset();
  }

  function _handleDistributeShots() {
    if (!sessions.length) return;

    const availableSessions = sessions.filter((session) => availableSessionsStatus.includes(session.status));
    const shotsToDistribute = Math.floor(availableShots / availableSessions.length);
    const remainingShots = availableShots % availableSessions.length;

    const newShotsPerSession = availableSessions.reduce(
      (acc, session, index) => {
        acc[session.id] = (shotsPerSession[session.id] || 0) + shotsToDistribute + (index < remainingShots ? 1 : 0);
        return acc;
      },
      {} as { [key: number]: number }
    );

    setShotsPerSession((prev) => ({
      ...prev,
      ...newShotsPerSession,
    }));
    setAvailableShots(0);
  }

  function _sessionsLoad(availableSessions: SessionProps[]) {
    if (sessions.length > 0) return;
    setSessions(availableSessions);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <Button variant="default" type="button" onClick={_handleDistributeShots} className="self-end mb-4 flex gap-x-2" disabled={availableShots === 0 || !sessions.length}>
          Distribuir disparos
          <ReplaceAll className="size-4" />
        </Button>

        <SessionCards
          hideActions={true}
          sessionStatus={availableSessionsStatus}
          // ref={store.user?.ref}
          shotsPerSession={shotsPerSession}
          onSessionClick={_handleOpenModal}
          onSessionsLoad={_sessionsLoad}
        />
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-background rounded-md border-none lg:max-w-screen-lg overflow-y-auto max-h-screen">
            <DialogHeader className="flex flex-col w-full items-start justify-between gap-y-2">Quantidade de disparos</DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(_handleSave)} className="flex gap-x-2 items-start">
                <FormField
                  control={form.control}
                  name="shotsCount"
                  render={({ field }) => (
                    <FormItem className="md:w-full">
                      {/* <FormLabel>Quantidade de disparos</FormLabel> */}
                      <FormControl>
                        <Input {...field} type="number" min={0} className="bg-zinc-100/80 dark:bg-zinc-950/80" placeholder="Informe a quantidade de disparos" defaultValue={0} />
                      </FormControl>
                      <FormLabel className="w-full flex justify-between px-2">
                        {/* <span className="text-sm">{field.value || 0}</span> */}
                        <span className="text-muted-foreground text-sm">Máx: {availableShots}</span>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant="default" type="submit" className="flex gap-x-2">
                  Salvar
                  <Check className="size-4" />
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
