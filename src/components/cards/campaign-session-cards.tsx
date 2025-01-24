// packages
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from "sonner";
import { LuQrCode } from "react-icons/lu";

// components
import { ConfirmationAlert } from "@/components/alerts/winners-alert";
import { CustomNoData } from "@/components/data/custom-no-data";
import { CampaignSessionCard } from "@/components/cards/campaign-session-card";
import { Skeleton } from "@/components/ui/skeleton";

// entities
import { CampaignProps, campaign_status } from "@/entities/campaign/campaign";
import { SessionProps, session_status } from "@/entities/session/session";

// store
import { useStore } from "@/store/store";

// lib
import { api } from "@/lib/axios";

// types
import { CampaignSessionCardActionProps } from "@/types/components/campaign-session-card-types";
type CampaignSessionCardsProps = {
  sessions?: SessionProps[];
};
type CampaignSessionCardProps = {
  campaign: CampaignProps
  session: SessionProps;
  error?: string;
  remainingAmount?: number;
  delay?: number;
};

// variables
const loc = "components/cards/campaign-session-cards";

const CampaignSessionCards = forwardRef((props: CampaignSessionCardsProps, ref) => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<CampaignSessionCardProps[]>((props.sessions || [])?.map((s) => ({ session: s })));
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{ session: SessionProps; action: CampaignSessionCardActionProps; cb: Function } | undefined>();

  function _handleConfirmation(session: SessionProps, action: CampaignSessionCardActionProps) {
    switch (action) {
      case "PAUSE":
        break;

      case "CONTINUE":
        break;

      default:
        break;
    }

    setSelectedSession({ session, action, cb: () => {} });
    setIsConfirmationOpen(true);
  }

  const _updateSessions = (index: number, session: CampaignSessionCardProps) => {
    const filteredSessions = sessions.filter((_, i) => i != index)
    setSessions([session, ...filteredSessions])
  };

  const _updateSessionError = ({ ref, message, details }: { ref: string; message: string; details: string }) => {
    const targetSessionIndex = sessions.findIndex((s) => s.session?.ref == ref);
    if (targetSessionIndex != -1) {
      _updateSessions(targetSessionIndex, Object.assign({}, sessions[targetSessionIndex], { error: message }));
      console.error(details);
    } else console.error(`Session not found at ${loc}._updateSessionError function. Details: ${JSON.stringify({ ref, message, details })}`);
  };

  const _updateSessionStatus = ({ ref, status }: { ref: string; status: session_status }) => {
    const targetSessionIndex = sessions.findIndex((s) => s.session?.ref == ref);
    if (targetSessionIndex != -1) _updateSessions(targetSessionIndex, Object.assign({}, sessions[targetSessionIndex], { session: { ...sessions[targetSessionIndex].session, status } }));
    else console.error(`Session not found at ${loc}._updateSessionStatus function. Details: ${JSON.stringify({ ref, status })}`);
  };

  const _updateSessionDelay = ({ ref, delay }: { ref: string; delay: number }) => {
    const targetSessionIndex = sessions.findIndex((s) => s.session?.ref == ref);
    if (targetSessionIndex != -1) _updateSessions(targetSessionIndex, Object.assign({}, sessions[targetSessionIndex], { delay }));
    else console.error(`Session not found at ${loc}._updateSessionDelay function. Details: ${JSON.stringify({ ref, delay })}`);
  };

  const _updateSessionRemainingAmount = ({ ref, remainingAmount }: { ref: string; remainingAmount: number }) => {
    const targetSessionIndex = sessions.findIndex((s) => s.session?.ref == ref);
    if (targetSessionIndex != -1) _updateSessions(targetSessionIndex, Object.assign({}, sessions[targetSessionIndex], { remainingAmount }));
    else console.error(`Session not found at ${loc}._updateSessionDelay function. Details: ${JSON.stringify({ ref, remainingAmount })}`);
  };

  useImperativeHandle(ref, () => ({
    updateSessionError: _updateSessionError,
    updateSessionStatus: _updateSessionStatus,
    updateSessionDelay: _updateSessionDelay,
    updateSessionRemainingAmount: _updateSessionRemainingAmount,
  }));

  useEffect(() => {
    setSessions((props.sessions || [])?.map(s => ({ session: s })))
  }, [props.sessions])

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-row smAndDown:flex-wrap gap-4 overflow-x-auto">
          {sessions.length ? (
            sessions.map((s, index) => <CampaignSessionCard key={index} campaign={s.campaign} session={s.session} error={s.error} remainingAmount={s.remainingAmount} delay={s.delay} handleChangeStatus={(session: SessionProps, action: CampaignSessionCardActionProps) => _handleConfirmation(session, action)} />)
          ) : (
            <div className="w-full">
              <CustomNoData title="Nenhuma sessão encontrada" description="Adicione uma sessão para visualizar os detalhes." icon={LuQrCode} iconClass={'size-16'} />

              {/* TODO: botão adicionar sessão */}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="grow mdAndDown:w-full lg:w-[calc(50%_-_16px)] xlAndUp:w-[calc(33.3%_-_16px)] min-h-[212px] rounded-lg flex flex-col items-center justify-between bg-zinc-300 dark:bg-muted" />
          ))}
        </div>
      )}

      {isConfirmationOpen && <ConfirmationAlert title="Confirmar?" description="Deseja confirmar?" cancel="Não" confirm="Sim" isOpenConfirmation={isConfirmationOpen} setIsOpenConfirmation={setIsConfirmationOpen} onConfirm={() => selectedSession?.cb && selectedSession.cb()} />}
    </>
  );
});

CampaignSessionCards.displayName = "CampaignSessionCards";

export default CampaignSessionCards;
