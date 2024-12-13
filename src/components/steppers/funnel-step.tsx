// packages
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FiCheck, FiPlus } from "react-icons/fi";

// components
import { Card, CardContent } from "@/components/ui/card";
import { CustomDataTable } from "@/components/table/custom-data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// store
import { CreateFunnelForm } from "@/components/forms/create-funnel-form";

// entities
import { campaign_category } from "@/entities/campaign/campaign";
import { CampaignContentsProps, CreateCampaignContentsSchema } from "@/entities/campaign_contents/campaign_contents";

// variables
const loc = "components/steppers/funnel-stepper";

// types
type ContextProps = "OPTIONS" | "FORM";
type FunnelStepProps = {
  onSubmitted(data: { category: campaign_category; contents: CreateCampaignContentsSchema[] }): void;
};

export function FunnelStep({ onSubmitted }: FunnelStepProps) {
  const [context, setContext] = useState<ContextProps>("FORM");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const campaignContents: CampaignContentsProps[] = []; // TODO: puxar da api

  const columns: ColumnDef<CampaignContentsProps>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <div>{row.original.campaign?.name}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Selecionar</span>
                  <FiCheck className="h-4 w-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>Selecionar</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full min-h-full">
      <CreateFunnelForm onSubmitted={onSubmitted} />

      {/* {context != "FORM" && (
        <CustomDataTable columns={columns} data={campaignContents} loading={isLoading}>
          <div className="flex flex-row gap-x-2">
            <Button onClick={() => setContext("FORM")} className="flex gap-x-2">
              <FiPlus className="h-4 w-4" />
              Criar
            </Button>
          </div>
        </CustomDataTable>
      )}

      {context === "FORM" && <CreateFunnelForm onSubmitted={onSubmitted} />} */}
    </div>
  );
}
