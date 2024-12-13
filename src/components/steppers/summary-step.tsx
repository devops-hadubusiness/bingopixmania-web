// packages
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";

// components
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// entities
import { ContactProps } from "@/entities/contact/contact";
import { CreateCampaignContentsSchema } from "@/entities/campaign_contents/campaign_contents";
import { CreateCampaignSchema } from "@/entities/campaign/campaign";

type SummaryStepProps = {
  data: CreateCampaignSchema;
};

export function SummaryStep({ data }: SummaryStepProps) {
  console.log("data:", data);

  return (
    <div className="min-h-full flex justify-center items-center my-auto">
      <div className="mdAndDown:w-full lg:w-[80%] xlAndUp:w-[60%] mx-auto min-h-full justify-center flex flex-col gap-y-4">
        <Card className="py-8 bg-background dark:bg-gray-900 border dark:border-gray-500 rounded-xl">
          <CardContent className="flex flex-col gap-y-8 items-center text-zinc-800 w-[80%] mx-auto">
            <CardTitle className="font-bold dark:text-foreground">RESUMO</CardTitle>
            <Separator className="w-full" />
            <div className="flex flex-col w-full gap-y-2 dark:text-foreground">
              <span className="font-semibold text-xl">CAMPANHA</span>
              <div className="flex gap-x-2">
                <Dot />
                <span className="font-semibold">NOME DA CAMPANHA:</span>
                <span>{data?.name || "-"}</span>
              </div>
              <div className="flex gap-x-2">
                <Dot />
                <span className="font-semibold">NÚMERO DE SESSÕES:</span>
                <span>{data?.shots.length}</span>
              </div>
              <div className="flex gap-x-2">
                <Dot />
                <span className="font-semibold">QUANTIDADE DE DISPAROS:</span>
                <span>{data?.contacts?.length}</span>
              </div>
            </div>
            <Separator className="w-full" />
            <div className="flex flex-col w-full gap-y-2 dark:text-foreground">
              <span className="text-xl">CONTATOS</span>
              <div className="flex gap-x-2">
                <Dot />
                <span className="font-semibold">QUANTIDADE DE CONTATOS:</span>
                <span>{data?.contacts?.length}</span>
              </div>
            </div>
            {/* <Separator className="w-full" />
            <div className="flex flex-col w-full gap-y-2">
              <span className="text-xl">FUNIL</span>
              <div className="flex gap-x-2">
                <Dot />
                <span className="font-semibold">NOME DO FUNIL:</span>
                <span>FUNIL 1</span>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Nome, Numero da sessão e quantidade de disparo
// Quantidade de contato
// Funil (direita scroll)
//