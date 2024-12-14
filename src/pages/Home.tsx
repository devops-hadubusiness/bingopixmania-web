// packages
import { useState, useRef, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

// components ui
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// components
// import SessionCards from "@/components/cards/session-cards";

// entities
import { session_status } from "@/entities/session/session";

// hooks
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [sessionStatus, setSessionStatus] = useState<string[]>(Object.keys(session_status).filter((s) => s !== session_status.DELETED));
  const [previousSessionStatus, setPreviousSessionStatus] = useState<string[]>([]);
  const [reconnectSessionRef, setReconnectSessionRef] = useState<string | undefined>();
  const sessionsCardRef = useRef();
  const allStatus = Object.values(session_status).filter((s) => s !== session_status.DELETED);
  const allSelected = sessionStatus.length === allStatus.length;

  // const handleCheckboxChange = useCallback(
  //   (status: session_status | "ALL") => {
  //     if (status === "ALL") {
  //       if (allSelected) setSessionStatus(previousSessionStatus);
  //       else {
  //         setPreviousSessionStatus(sessionStatus);
  //         setSessionStatus(allStatus);
  //       }
  //     } else {
  //       setSessionStatus((prev) => {
  //         if (prev.includes(status)) return prev.filter((s) => s !== status);
  //         return [...prev, status];
  //       });
  //     }
  //   },
  //   [allSelected, previousSessionStatus, sessionStatus, allStatus]
  // );

  // const handleReconnect = useCallback((sessionRef: string) => {
  //   setReconnectSessionRef(sessionRef);
  // }, []);

  // useEffect(() => {
  //   if (reconnectSessionRef && !isCreatingSession) setIsCreatingSession(true);
  // }, [reconnectSessionRef, isCreatingSession]);

  return (
    <div className="flex w-full flex-col justify-center gap-y-4 p-8">
      <div className="hidden w-full flex smAndDown:flex-wrap items-center xs:justify-center smAndUp:justify-between gap-y-4">
        <Button variant="default" onClick={() => setIsCreatingSession(true)} className="smAndDown:w-full flex gap-x-2" disabled={isLoading}>
          <Plus className="size-5" />
          Adicionar Sessão
        </Button>
        <Textarea className="resize-none min-h-40" />

        <div className="flex flex-wrap flex-grow smAndDown:justify-center mdAndUp:justify-end items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={allSelected} onCheckedChange={() => handleCheckboxChange("ALL")} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange("ALL")}>
              Todas
            </Label> */}
          </div>
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={sessionStatus.includes(session_status.ACTIVE)} onCheckedChange={() => handleCheckboxChange(session_status.ACTIVE)} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange(session_status.ACTIVE)}>
              Ativas
            </Label> */}
          </div>
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={sessionStatus.includes(session_status.PENDING)} onCheckedChange={() => handleCheckboxChange(session_status.PENDING)} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange(session_status.PENDING)}>
              Pendentes
            </Label> */}
          </div>
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={sessionStatus.includes(session_status.BLOCKED)} onCheckedChange={() => handleCheckboxChange(session_status.BLOCKED)} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange(session_status.BLOCKED)}>
              Bloqueadas
            </Label> */}
          </div>
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={sessionStatus.includes(session_status.BUSY)} onCheckedChange={() => handleCheckboxChange(session_status.BUSY)} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange(session_status.BUSY)}>
              Em uso
            </Label> */}
          </div>
          <div className="flex items-center gap-x-2 group hover:cursor-pointer">
            {/* <Checkbox checked={sessionStatus.includes(session_status.INACTIVE)} onCheckedChange={() => handleCheckboxChange(session_status.INACTIVE)} />
            <Label className="group-hover:cursor-pointer" onClick={() => handleCheckboxChange(session_status.INACTIVE)}>
              Inativas
            </Label> */}
          </div>
        </div>
      </div>

      {/* <SessionCards ref={sessionsCardRef} sessionStatus={sessionStatus} handleReconnect={handleReconnect} onLoadingChange={(loading) => setIsLoading(loading)} /> */}

      {/* {isCreatingSession && (
        <CreateSessionDialog
          open={isCreatingSession}
          sessionRef={reconnectSessionRef}
          cb={(message?: string) => {
            if (message) toast({ variant: "success", title: "Sucesso", description: message || "" });
            sessionsCardRef.current?.getUserSessionsByStatus?.();
            setReconnectSessionRef(undefined);
            setIsCreatingSession(false);
          }}
        />
      )} */}
    </div>
  );
}
