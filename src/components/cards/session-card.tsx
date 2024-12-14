// packages
import { Trash, Unplug, RefreshCcw, Pause, Play } from "lucide-react";

// components
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// entities
import { SessionProps, session_status, formatted_session_status } from "@/entities/session/session";

// utils
import { formatPhoneNumber } from "@/utils/formatters-util";
import { getSessionStatusBadgeStyle } from "@/utils/badges-util";

// types
type SessionCardProps = {
  session: SessionProps;
  hideActions?: boolean;
  onSelected: (session: SessionProps, status: session_status) => void;
  shotsCount?: number;
  handleClick?: () => void;
};

export function SessionCard({ session, hideActions, onSelected, shotsCount, handleClick }: SessionCardProps) {
  return (
    <Card onClick={handleClick} className="mdAndDown:w-full lg:w-[calc(50%_-_16px)] xlAndUp:w-[calc(33.33%_-_16px)] bg-background dark:bg-gray-700 ring-0 ring-offset-0 grid grid-cols-12 pb-4 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-accent dark:hover:border-gray-500">
      <div className="col-span-12 flex flex-col justify-center items-center pt-4">
        <CardContent className="flex items-center justify-between w-full gap-x-2 truncate">
          <div className="flex flex-col items-start w-full truncate">
            <span className="text-lg font-bold truncate">{session?.name}</span>
            <span className="text-sm font-semibold truncate">{session?.profileName ?? "-"}</span>
            <span className="text-sm font-medium truncate">{session?.phone ? formatPhoneNumber(session.phone) : ""}</span>
            {shotsCount ? <span className="text-xs text-zinc-500 truncate">Disparos: {shotsCount}</span> : null}
          </div>

          <div className="xxs:hidden grow">
            <Avatar className="size-24">{session?.profilePicURL ? <AvatarImage className="size-24" src={session?.profilePicURL} /> : <AvatarImage className="size-24" src="/images/placeholders/avatar-placeholder.png" />}</Avatar>

            <Badge className={`w-24 flex items-center justify-center ${getSessionStatusBadgeStyle(session.status)} relative top-3 left-0 -mt-6`}>{formatted_session_status[session?.status]}</Badge>
          </div>
        </CardContent>
      </div>

      {!hideActions && session.status == session_status.PAUSED && (
        <div className="col-span-6 pl-4 pr-2">
          <Button
            className="rounded-lg size-8 bg-blue-700 bg-opacity-30 dark:text-blue-500 text-blue-700 hover:brightness-125 hover:bg-blue-700 hover:bg-opacity-30 w-full gap-x-2"
            onClick={() => session.status == session_status.PAUSED && onSelected(session, session_status.BUSY)}
            disabled={session.status != session_status.PAUSED}
          >
            Continuar
            <Play className="size-5" />
          </Button>
        </div>
      )}

      {!hideActions && session.status == session_status.BUSY && (
        <div className="col-span-6 pl-4 pr-2">
          <Button
            className="rounded-lg size-8 bg-yellow-700 bg-opacity-30 dark:text-yellow-500 text-yellow-700 hover:brightness-125 hover:bg-yellow-700 hover:bg-opacity-30 w-full gap-x-2"
            onClick={() => session.status == session_status.BUSY && onSelected(session, session_status.PAUSED)}
            disabled={session.status != session_status.BUSY}
          >
            Pausar
            <Pause className="size-5" />
          </Button>
        </div>
      )}

      {!hideActions && [session_status.PENDING, session_status.INACTIVE].includes(session.status) && (
        <div className="col-span-6 pl-4 pr-2">
          <Button
            className="rounded-lg size-8 bg-primary/30 dark:text-white text-primary-text hover:brightness-125 hover:bg-primary hover:bg-primary/30 w-full gap-x-2"
            onClick={() => [session_status.PENDING, session_status.INACTIVE].includes(session.status) && onSelected(session, session_status.ACTIVE)}
            disabled={![session_status.PENDING, session_status.INACTIVE].includes(session.status)}
          >
            Reconectar
            <RefreshCcw className="size-5" />
          </Button>
        </div>
      )}

      {!hideActions && session.status == session_status.ACTIVE && (
        <div className="col-span-6 pl-4 pr-2">
          <Button
            className="rounded-lg size-8 bg-yellow-700 bg-opacity-30 dark:text-yellow-500 text-yellow-700 hover:brightness-125 hover:bg-yellow-700 hover:bg-opacity-30 w-full gap-x-2"
            onClick={() => session.status == session_status.ACTIVE && onSelected(session, session_status.PENDING)}
            disabled={session.status != session_status.ACTIVE}
          >
            Desconectar
            <Unplug className="size-5" />
          </Button>
        </div>
      )}

      {!hideActions && (
        <div className={`pr-4 pl-2 ${session.status != session_status.BLOCKED ? "col-span-6" : "col-span-12"}`}>
          <Button
            className="rounded-lg size-8 bg-red-700 bg-opacity-30 dark:text-red-500 text-red-700 hover:brightness-125 hover:bg-red-700 hover:bg-opacity-30 w-full gap-x-2"
            onClick={() => session.status != session_status.BUSY && onSelected(session, session_status.DELETED)}
            disabled={session.status == session_status.BUSY}
          >
            Deletar
            <Trash className="size-5" />
          </Button>
        </div>
      )}
    </Card>
  );
}
