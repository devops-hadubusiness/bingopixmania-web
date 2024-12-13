// packages
import { useEffect, useState } from "react";
import { Pause } from "lucide-react";

// components
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// entities
import { CampaignProps, campaign_status } from "@/entities/campaign/campaign";
import { SessionProps, formatted_session_status } from "@/entities/session/session";

// utils
import { formatPhoneNumber } from "@/utils/formatters-util";
import { getSessionStatusBadgeStyle } from "@/utils/badges-util";

// types
import { CampaignSessionCardActionProps } from "@/types/components/campaign-session-card-types";
type CampaignSessionCardProps = {
  campaign: CampaignProps;
  session: SessionProps;
  error?: string;
  remainingAmount?: number;
  delay?: number;
  handleChangeStatus: (session: SessionProps, action: CampaignSessionCardActionProps) => void;
};

export function CampaignSessionCard({ campaign, session, error, remainingAmount, delay, handleChangeStatus }: CampaignSessionCardProps) {
  const [remainingDelay, setRemainingDelay] = useState<number | undefined>(undefined);
  useEffect(() => {
    // setRemainingDelay(delay)
    let interval: NodeJS.Timeout;
    console.warn(delay);
    if (delay) {
      if (!remainingDelay) setRemainingDelay(delay);

      interval = setInterval(() => {
        setRemainingDelay(remainingDelay - 1);

        if (remainingDelay - 1 <= 0) clearInterval(interval);
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [delay]);

  useEffect(() => {}, [session, error, remainingAmount]);

  return (
    <Card className="mdAndDown:w-full lg:w-1/2 xlAndUp:w-1/3 bg-background dark:bg-gray-700 ring-0 ring-offset-0 grid grid-cols-12 pb-4 hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-accent dark:hover:border-gray-500">
      <div className="col-span-12 flex flex-col justify-center items-center pt-4">
        <CardContent className="flex items-center justify-between w-full gap-x-2">
          <div className="flex flex-col items-start w-full truncate">
            <span className="text-lg font-bold truncate">{session?.name}</span>
            <span className="text-sm font-semibold truncate">{session?.profileName ?? "-"}</span>
            <span className="text-sm font-medium truncate">{session?.phone ? formatPhoneNumber(session.phone) : ""}</span>
            <span className="text-xs text-zinc-500 truncate">Restantes: {remainingAmount || "-"}</span>
            <span className="text-xs text-zinc-500 truncate">Próximo: {remainingDelay ? `${remainingDelay} seg.` : "-"}</span>
            {error && <span className="text-xs text-red-500 dark:text-red-700 truncate">Erro: {error}</span>}
          </div>

          <div className="xxs:hidden grow">
            <Avatar className="size-24">{!!session?.profilePicURL ? <AvatarImage className="size-24" src={session?.profilePicURL} /> : <AvatarImage className="size-24" src="/images/placeholders/avatar-placeholder.png" />}</Avatar>

            <Badge className={`w-24 flex items-center justify-center ${getSessionStatusBadgeStyle(session.status)} relative top-3 left-0 -mt-6`}>{formatted_session_status[session?.status]}</Badge>
          </div>
        </CardContent>
      </div>

      <div className="col-span-12 px-4">
        {/* disabled={campaign.status != campaign_status.RUNNING} */}
        <Button className="rounded-lg size-8 bg-yellow-700 bg-opacity-30 dark:text-yellow-500 text-yellow-700 hover:brightness-125 hover:bg-yellow-700 hover:bg-opacity-30 w-full gap-x-2" disabled={true}>
          Pausar
          <Pause className="size-5" />
        </Button>
      </div>
    </Card>
  );
}
