// packages
import { useState, useReducer, useEffect } from "react";
import { Plus, Check, ChevronRight, ChevronLeft, Play, Pause, Eye, Trash } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// components
import { CreateCampaignDialog } from "@/components/dialogs/create-campaign-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ContactsStep } from "@/components/steppers/contacts-step";
import { FunnelStep } from "@/components/steppers/funnel-step";
import { CustomDataTable } from "@/components/table/custom-data-table";
import { StepperCounter } from "@/components/steppers/stepper-counter";
import { SessionsStep } from "@/components/steppers/session-step";
import { SummaryStep } from "@/components/steppers/summary-step";
import { ConfirmationAlert } from "@/components/alerts/confirmation-alert";

// entities
import { ContactProps } from "@/entities/contact/contact";
import { CampaignContentsProps, CreateCampaignContentsSchema } from "@/entities/campaign_contents/campaign_contents";
import { campaign_category, campaign_status, CampaignProps, CreateCampaignSchema, createCampaignSchema, formatted_campaign_status } from "@/entities/campaign/campaign";

// store
import { useStore } from "@/store/store";

// lib
import { api } from "@/lib/axios";

// hooks
import { useToast } from "@/hooks/use-toast";

// constants
import { HTTP_STATUS_CODE } from "@/constants/http";

// utils
import { getCampaignStatusBadgeStyle } from "@/utils/badges-util";

// types
type ContextProps = "TABLE" | "FORM";
type ShotsProps = {
  sessionId: number;
  shots: number;
};
type NameReducerActionProps = {
  type: "submitted" | "reset";
  name: string;
};
type ContactsReducerActionProps = {
  type: "selected" | "imported" | "reset";
  contacts: ContactProps[];
};
type ContentsReducerActionProps = {
  type: "selected" | "added" | "reset";
  contents: CreateCampaignContentsSchema[];
};
type SessionsReducerActionProps = {
  type: "submitted" | "reset";
  shots: ShotsProps[];
};

// variables
const loc = "@/pages/Campaigns";

export default function CampaignsPage() {
  const { toast } = useToast();
  const store = useStore();
  const navigate = useNavigate();
  const [context, setContext] = useState<ContextProps>("TABLE");
  const [step, setStep] = useState<number>(1);
  const [isNextStepAvailable, setIsNextStepAvailable] = useState<boolean>(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [previousButtonCb, setPreviousButtonCb] = useState<() => void | undefined>();
  const [isConfirmationBackwardAlertOpen, setIsConfirmationBackwardAlertOpen] = useState(false);
  const [name, dispatchName] = useReducer(nameReducer, "");
  const [contacts, dispatchContacts] = useReducer(contactsReducer, []);
  const [contents, dispatchContents] = useReducer(contentsReducer, []);
  const [shotsAndSessions, dispatchShotsAndSessions] = useReducer(sessionsReducer, []);
  const [data, setData] = useState<CampaignProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [newCampaing, setNewCampaing] = useState<CreateCampaignSchema>({});
  const [isConfirmationDeleteAlertOpen, setIsConfirmationDeleteAlertOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignProps>({} as CampaignProps);

  // useEffect(() => {
  //   const data = form.getValues();
  //   setNewCampaing(data);
  // }, []);

  const columns: ColumnDef<CampaignProps>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className={`rounded-md py-1 px-2 text-center ${getCampaignStatusBadgeStyle(row.original.status)}`}>{formatted_campaign_status[row.original.status] || "-"}</span>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end gap-x-2">
            {item.status === campaign_status.WAITING ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" onClick={() => _handleUpdateCampaignStatus(item.ref, "start")} className="size-8 p-0 bg-primary/30 text-primary dark:text-white hover:bg-primary/30 hover:brightness-125">
                    <span className="sr-only">Iniciar</span>
                    <Play className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-accent text-xs">
                  Iniciar
                </TooltipContent>
              </Tooltip>
            ) : item.status === campaign_status.RUNNING ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" onClick={() => _handleUpdateCampaignStatus(item.ref, "pause")} className="size-8 p-0 bg-yellow-500/30 dark:bg-yellow-700/30 hover:bg-yellow-500/30 dark:hover:bg-yellow-700/30 text-yellow-500 dark:text-yellow-700 hover:brightness-125">
                    <span className="sr-only">Pausar</span>
                    <Pause className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-accent text-xs">
                  Pausar
                </TooltipContent>
              </Tooltip>
            ) : item.status === campaign_status.PAUSED ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" onClick={() => _handleUpdateCampaignStatus(item.ref, "continue")} className="size-8 p-0 bg-blue-500/30 dark:bg-blue-700/30 hover:bg-blue-500/30 dark:hover:bg-blue-500/30 text-blue-500 dark:text-blue-700 hover:brightness-125">
                    <span className="sr-only">Continuar</span>
                    <Play className="size-4 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-accent text-xs">
                  Continuar
                </TooltipContent>
              </Tooltip>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" className="size-8 p-0 bg-gray-500/30 text-gray-500 dark:text-white hover:bg-gray-500/30 hover:brightness-125" onClick={() => navigate(`/campanhas/${row.original.ref}/detalhes`)}>
                  <span className="sr-only">Visualizar</span>
                  <Eye className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-accent text-xs">
                Visualizar
              </TooltipContent>
            </Tooltip>

            {![campaign_status.DONE, campaign_status.CANCELED, campaign_status.DELETED].includes(item.status) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" onClick={() => _handleConfirmationDelete(item)} className="size-8 p-0 bg-red-700/30 text-red-700 hover:bg-red-700/30 hover:brightness-125">
                    <span className="sr-only">Deletar</span>
                    <Trash className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-accent text-xs">
                  Deletar
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const form = useForm<CreateCampaignSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      companyId: store.company?.id,
      userId: store.user?.id,
      category: campaign_category.INDIVIDUAL,
    },
  });

  const newData = form.watch();
  // console.log("new data", newData);

  async function _fetchCampaigns() {
    try {
      setIsLoading(true);

      const response = await api.get("/", {
        params: {
          action: "campaigns_user_by_status",
          userId: store.user?.id,
          companyId: store.company?.id,
          status: JSON.stringify([campaign_status.DONE, campaign_status.WAITING, campaign_status.RUNNING, campaign_status.PAUSED, campaign_status.CANCELED]),
        },
      });

      if (response.data.body?.length > 0) setData(response.data.body[0].campaigns || []);
      else setData([]);
    } catch (err) {
      console.error(`Unhandled error at @/pages/Campaigns._fetchCampaing function. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível buscar as campanhas." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    _fetchCampaigns();
  }, []);

  useEffect(() => {
    setPreviousButtonCb(undefined);
  }, [step]);

  async function _handleUpdateCampaignStatus(ref: string, action: "start" | "pause" | "continue") {
    try {
      // TODO: colocar confirmação
      setIsLoading(true);

      let campaignStatus = "",
        toastSuccess = "",
        toastError = "",
        cb;

      switch (action) {
        case "start":
          campaignStatus = campaign_status.RUNNING;
          toastSuccess = "Campanha iniciada com sucesso.";
          toastError = "Não foi possível inicar a campanha.";

          // TODO: descomentar
          cb = () => navigate(`/campanhas/${ref}/detalhes`);
          // cb = () => {};
          break;

        case "continue":
          campaignStatus = campaign_status.RUNNING;
          toastSuccess = "Campanha atualizada com sucesso.";
          toastError = "Não foi possível atualizar a campanha.";

          // TODO: descomentar
          cb = () => navigate(`/campanhas/${ref}/detalhes`);
          // cb = () => {};
          break;

        case "pause":
          campaignStatus = campaign_status.PAUSED;
          toastSuccess = "Campanha pausada com sucesso.";
          toastError = "Não foi possível pausar a campanha.";
          cb = async () => await _fetchCampaigns();
      }

      const response = await api.put("/", {
        action: "campaign",
        ref,
        userId: store.user?.id,
        companyId: store.company?.id,
        status: campaignStatus,
      });

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        toast({ variant: "success", title: "Sucesso", description: toastSuccess });
        cb();
      } else toast({ variant: "destructive", title: "Ops ...", description: toastError });
    } catch (err) {
      toast({ variant: "destructive", title: "Ops ...", description: "Erro na operação." });
      console.error(`Unhandled error at @/pages/Campaigns._handleUpdateCampaignstatus. Details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  function _handleConfirmationDelete(item: CampaignProps) {
    setSelectedCampaign(item);
    setIsConfirmationDeleteAlertOpen(true);
  }

  async function _handleDeleteCampaign(campaignRef: string) {
    try {
      setIsLoading(true);

      const response = await api.delete("/", {
        data: {
          action: "campaign",
          ref: campaignRef,
          userId: store.user?.id,
          companyId: store.company?.id,
        },
      });

      if (response.data?.statusCode === HTTP_STATUS_CODE.OK) {
        toast({ variant: "success", title: "Sucesso", description: "Campanha deletada com sucesso." });
        await _fetchCampaigns();
      } else toast({ variant: "destructive", title: "Ops ...", description: response.data?.statusMessage || "Não foi possível deletar a campanha." });
    } catch (err) {
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível deletar a campanha." });
      console.error(`Unhandled error at @/pages/Campaigns._handleDeleteCampaign. Details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  function _handleCampaign(name: NameReducerActionProps) {
    dispatchName({ type: "submitted", name: name.name });
  }

  function _handleContacts(contacts: ContactProps[]) {
    dispatchContacts({ type: "imported", contacts });
  }

  function _handleFunnel(data: { category: campaign_category; contents: CreateCampaignContentsSchema[] }) {
    dispatchContents({ type: "added", contents: data.contents });
  }

  function _handleSessionStep(shotsAndSessions: ShotsProps[]) {
    dispatchShotsAndSessions({ type: "submitted", shots: shotsAndSessions });
  }

  function nameReducer(name: string, action: NameReducerActionProps) {
    switch (action.type) {
      case "submitted":
        return action.name;

      case "reset":
        return "";

      default:
        console.error(`Unhandled error at ${loc}.nameReducer function. Details: ${JSON.stringify(action)}`);
        return name;
    }
  }

  function contactsReducer(contacts: ContactProps[], action: ContactsReducerActionProps) {
    switch (action.type) {
      case "selected":
      case "imported":
        return Array.from(action.contacts || []);

      case "reset":
        return [];

      default:
        console.error(`Unhandled error at ${loc}.contactsReducer function. Details: ${JSON.stringify(action)}`);
        return Array.from(contacts || []);
    }
  }

  function contentsReducer(contents: CreateCampaignContentsSchema[], action: ContentsReducerActionProps) {
    switch (action.type) {
      case "selected":
      case "added":
        return Array.from(action.contents || []);

      case "reset":
        return [];

      default:
        console.error(`Unhandled error at ${loc}.contentsReducer function. Details: ${JSON.stringify(action)}`);
        return Array.from(contents || []);
    }
  }

  function sessionsReducer(shotsAndSessions: ShotsProps[], action: SessionsReducerActionProps) {
    switch (action.type) {
      case "submitted":
        return Array.from(action.shots || []);

      case "reset":
        return [];

      default:
        return Array.from(shotsAndSessions || []);
    }
  }

  function _handleBackwardCampaign() {
    if (previousButtonCb) previousButtonCb();
    else if (step == 1) {
      form.reset();
      dispatchName({ type: "reset", name: "" });
      dispatchContacts({ type: "reset", contacts: [] });
      dispatchContents({ type: "reset", contents: [] });
      dispatchShotsAndSessions({ type: "reset", shots: [] });
      setContext("TABLE");
    } else setStep(step - 1);

    setIsConfirmationBackwardAlertOpen(false);
  }

  useEffect(() => {
    form.setValue("name", name);
    if (name) setContext("FORM");
  }, [name]);

  useEffect(() => {
    switch (step) {
      case 1:
        setIsNextStepAvailable(!!contacts.length);
        form.setValue("contacts", Array.from(contacts || []));
        break;

      case 2:
        setIsNextStepAvailable(!!contents.length);
        form.setValue("contents", Array.from(contents || []));
        break;

      case 3:
        setIsNextStepAvailable(!!shotsAndSessions.length);
        form.setValue("shots", Array.from(shotsAndSessions || []));
        break;
    }
  }, [step, contacts, contents, shotsAndSessions]);

  async function _handleCreateCampaign() {
    try {
      setIsLoading(true);

      const response = await api.post("/", {
        action: "campaign",
        userId: store.user?.id,
        companyId: store.company?.id,
        name: newData.name,
        category: newData.category,
        contents: newData.contents,
        contacts: newData.contacts.map((c) => ({ ...c, phone: c.phone.replace(/\D/g, "") })),
        shots: newData.shots,
      });

      if (response.data?.statusCode === HTTP_STATUS_CODE.CREATED) {
        toast({ variant: "success", title: "Sucesso", description: response.data?.statusMessage || "Campanha criada com sucesso." });
        await _fetchCampaigns();
        setStep(1);
        setContext("TABLE");
      } else toast({ variant: "destructive", title: "Ops ...", description: response.data?.statusMessage || "Não foi possível criar a campanha." });
    } catch (err) {
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível criar a campanha." });
      console.error(`Unhandled error at @/pages/Campaigns._handleCreateCampaign. Details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`flex flex-col w-full min-h-full gap-y-8 p-8 pb-16 relative ${context === "FORM" && "py-0"}`}>
      {context === "FORM" && (
        <div className="w-full items-center rounded-md">
          <StepperCounter step={step} />
        </div>
      )}

      <div className="flex-1 h-full flex flex-col">
        {context === "TABLE" && (
          <CustomDataTable columns={columns} data={data} loading={isLoading}>
            {context === "TABLE" && (
              <Button onClick={() => setIsCreatingCampaign(true)} className="smAndDown:w-full flex gap-x-2" disabled={isLoading}>
                <Plus className="size-5" />
                Criar Campanha
              </Button>
            )}
          </CustomDataTable>
        )}

        {context === "FORM" && step == 1 && <ContactsStep onUploaded={_handleContacts} togglePreviousButton={(cb?: () => void) => setPreviousButtonCb(cb)} />}
        {context === "FORM" && step == 2 && <FunnelStep onSubmitted={_handleFunnel} />}
        {context === "FORM" && step == 3 && <SessionsStep onShotsDistributed={_handleSessionStep} contactsLength={newData.contacts.length} />}
        {context === "FORM" && step == 4 && <SummaryStep data={newData} />}

        {isCreatingCampaign && (
          <CreateCampaignDialog
            open={isCreatingCampaign}
            cb={(name: string) => {
              _handleCampaign(name);
              setIsCreatingCampaign(false);
            }}
          />
        )}
      </div>

      {context === "FORM" && (
        <>
          <div className={`w-full fixed bottom-0 left-0 h-16 bg-background border-t flex items-center gap-x-2 px-8 ${step <= 4 || previousButtonCb ? "justify-between" : "justify-end"}`}>
            {(step <= 4 || previousButtonCb) && (
              <Button variant="default" onClick={() => setIsConfirmationBackwardAlertOpen(true)} className="flex gap-x-2" disabled={isLoading}>
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
            )}

            {step <= 3 && (
              <Button onClick={() => setStep(step + 1)} className="flex gap-x-2" disabled={!isNextStepAvailable || isLoading}>
                Próximo
                <ChevronRight className="size-4" />
              </Button>
            )}

            {step >= 4 && (
              <Button
                variant="default"
                onClick={
                  () => _handleCreateCampaign()
                  //   {
                  //   // TODO: chamar API
                  //   setStep(1);
                  //   setContext("TABLE");
                  // }
                }
                className="flex gap-x-2"
                loading={isLoading}
                disabled={!isNextStepAvailable || isLoading}
              >
                <Check className="size-4" />
                Confirmar
              </Button>
            )}
          </div>
        </>
      )}

      {isConfirmationBackwardAlertOpen && (
        <ConfirmationAlert
          cancel="Não"
          confirm="Sim"
          description="Deseja confirmar?"
          onConfirm={_handleBackwardCampaign}
          isOpenConfirmation={isConfirmationBackwardAlertOpen}
          setIsOpenConfirmation={setIsConfirmationBackwardAlertOpen}
          title="Confirmação"
          onCancel={() => setIsConfirmationBackwardAlertOpen(false)}
        />
      )}

      {isConfirmationDeleteAlertOpen && (
        <ConfirmationAlert
          cancel="Não"
          confirm="Sim"
          description="Deseja deletar essa campanha?"
          onConfirm={() => _handleDeleteCampaign(selectedCampaign.ref)}
          isOpenConfirmation={isConfirmationDeleteAlertOpen}
          setIsOpenConfirmation={setIsConfirmationDeleteAlertOpen}
          title="Confirmação"
          onCancel={() => setSelectedCampaign({} as CampaignProps)}
        />
      )}
    </div>
  );
}
