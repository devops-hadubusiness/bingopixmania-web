// packages
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { QrCode } from "lucide-react";

// components
import { ConfirmationAlert } from "@/components/alerts/winners-alert";
import { CustomNoData } from "@/components/data/custom-no-data";
import { SessionCard } from "@/components/cards/session-card";
import { Skeleton } from "@/components/ui/skeleton";

// entities
import { SessionProps, session_status } from "@/entities/session/session";

// store
import { useStore } from "@/store/store";

// hooks
import { useToast } from "@/hooks/use-toast";

// lib
import { api } from "@/lib/axios";

// types
import { ConfirmationAlertProps } from "@/types/components/alerts/confirmation-alert-types";
type SessionCardsProps = {
  hideActions?: boolean;
  sessionStatus: string[];
  shotsPerSession?: { [key: number]: number };
  onSessionClick?: (sessionId: number, shotsCount: number) => void;
  onSessionsLoad?: (sessions: SessionProps[]) => void;
  handleReconnect?: (sessionRef: string) => void;
  onLoadingChange?: (loading: boolean) => void;
};

// variables
const loc = "components/cards/session-cards";

const SessionCards = forwardRef(({ hideActions, sessionStatus, shotsPerSession, onSessionClick, onSessionsLoad, handleReconnect, onLoadingChange }: SessionCardsProps, ref) => {
  const { toast } = useToast();
  const store = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedSessions, setFetchedSessions] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionProps[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionProps | null>(null);
  const [confirmationConfig, setConfirmationConfig] = useState<ConfirmationAlertProps | undefined>();
  const filteredSessions = sessions.filter((s: SessionProps) => sessionStatus.includes(s.status));

  const _getUserSessionsByStatus = useCallback(async () => {
    try {
      setIsLoading(true);

      const filteredStatus = sessionStatus.filter((status) => status !== session_status.DELETED);

      const response = await api.get("/", {
        params: {
          action: "sessions_user_by_status",
          companyId: store.company?.id,
          userId: store.user?.id,
          status: JSON.stringify(filteredStatus),
        },
      });

      if (![200, 404].includes(response.data?.statusCode)) toast({ variant: "destructive", title: "Ops ...", description: response.data?.statusMessage || "Não foi possível buscar as sessões." });
      else {
        setSessions(Array.from(response.data.body?.[0]?.sessions || []));
        if (onSessionsLoad) onSessionsLoad(Array.from(response.data.body?.[0]?.sessions || []));
      }
    } catch (err) {
      console.error(`Unhandled error at ${loc}._getUserSessionsByStatus. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível buscar as sessões." });
      setSessions([]);
    } finally {
      setIsLoading(false);
      setFetchedSessions(true);
    }
  }, [onSessionsLoad, sessionStatus]);

  function handleConfirmation(session: SessionProps, status: session_status) {
    setSelectedSession(session);

    const config: ConfirmationAlertProps = {
      open: true,
      title: "Confirmação",
      description: "Deseja mesmo $slot essa sessão?",
      cb: async () => await _handleUpdateSession(session.ref, status),
    };

    const mapper = {
      [session_status.BUSY]: { slot: "continuar" },
      [session_status.PAUSED]: { slot: "pausar" },
      [session_status.ACTIVE]: { slot: "reconectar", cb: (sessionRef: string) => handleReconnect && handleReconnect(sessionRef) },
      [session_status.PENDING]: { slot: "desconectar" },
      [session_status.DELETED]: { slot: "deletar" },
    };

    if (!Object.keys(mapper).some((s) => s == status)) return;

    config.description = config.description.split("$slot").join(mapper[status]?.slot);
    if (mapper[status]?.cb) config.cb = mapper[status].cb;

    setConfirmationConfig(config);
  }

  async function _handleUpdateSession(sessionRef: string, status: session_status) {
    try {
      setIsLoading(true);

      const methodCb = async (data) => await (status == session_status.DELETED ? api.delete("/", { data }) : api.put("/", data));

      const response = await methodCb({
        action: "session",
        userId: store.user?.id,
        companyId: store.company?.id,
        ref: sessionRef,
        name: sessions.find((s) => s.ref === sessionRef)?.name,
        status,
      });

      if (![200, 404].includes(response.data?.statusCode)) toast({ variant: "destructive", title: "Ops ...", description: response.data?.statusMessage || "Não foi possível atualizar a sessão." });
      else {
        toast({ variant: "success", title: "Sucesso", description: response.data?.statusMessage || "Sessão atualizada com sucesso." });
        await _getUserSessionsByStatus();
      }
    } catch (err) {
      console.error(`Unhandled error at ${loc}._handleUpdateSession. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível atualizar a sessão." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoading && !fetchedSessions && !sessions.length) _getUserSessionsByStatus();
  }, [sessionStatus]);

  useEffect(() => {
    if (onLoadingChange) onLoadingChange(isLoading);
  }, [isLoading]);

  useImperativeHandle(ref, () => ({
    getUserSessionsByStatus: _getUserSessionsByStatus,
  }));

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-wrap gap-4">
          {filteredSessions.length ? (
            filteredSessions.map((session, index) => (
              <SessionCard
                key={index}
                session={session}
                hideActions={hideActions}
                onSelected={handleConfirmation}
                handleClick={onSessionClick ? () => onSessionClick(session.id, shotsPerSession ? shotsPerSession[session.id] : 0) : () => {}}
                shotsCount={shotsPerSession && shotsPerSession[session.id]}
              />
            ))
          ) : (
            <div className="w-full">
              <CustomNoData title="Nenhuma sessão encontrada" description="Adicione uma sessão para visualizar os detalhes." icon={QrCode} iconClass={"size-16"} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="grow mdAndDown:w-full lg:w-[calc(50%_-_16px)] xlAndUp:w-[calc(33.3%_-_16px)] min-h-[212px] rounded-lg flex flex-col items-center justify-between bg-zinc-300 dark:bg-muted" />
          ))}
        </div>
      )}

      {confirmationConfig?.open && (
        <ConfirmationAlert
          title="Confirmação"
          description={confirmationConfig?.description || ""}
          cancel="Não"
          confirm="Sim"
          isOpenConfirmation={!!confirmationConfig?.open}
          setIsOpenConfirmation={() => setConfirmationConfig(undefined)}
          onConfirm={() => confirmationConfig?.cb(selectedSession?.ref)}
        />
      )}
    </>
  );
});

SessionCards.displayName = "SessionCards";

export default SessionCards;
