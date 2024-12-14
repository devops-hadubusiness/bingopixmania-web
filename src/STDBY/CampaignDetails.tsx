// packages
import { useState, useRef, useEffect, useContext } from "react";
// import { PiUserMinusLight, PiUserPlus, PiUsersThree } from "react-icons/pi";
// import { LuQrCode, LuContact2, LuWorkflow, LuTrendingUp } from "react-icons/lu";
import { Label, Pie, PieChart, LabelList, RadialBar, RadialBarChart, PolarRadiusAxis } from "recharts";
import { Bar, BarChart, XAxis } from "recharts";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useNavigate } from "react-router-dom";
// import { Socket } from "socket.io-client";
import { format } from "date-fns-tz";
import _ from "underscore";

// components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CustomDataTable } from "@/components/table/custom-data-table";
import CampaignSessionCards from "@/components/cards/campaign-session-cards";

// entities
import { SessionProps } from "@/entities/session/session";
import { CampaignProps } from "@/entities/campaign/campaign";
import { campaign_result_status, formatted_campaign_result_status, CampaignResultsProps } from "@/entities/campaign_results/campaign_results";
import { campaign_content_result_status } from "@/entities/campaign_content_result/campaign_content_result";
import { contact_status, formatted_contact_status } from "@/entities/contact/contact";

// hooks
import { useToast } from "@/hooks/use-toast";

// utils
// import { getSocketIOClient } from "@/utils/sockets-util";
// const getSocketIOClient = () => {};
import { formatPhoneNumber } from "@/utils/formatters-util";
import { timeZone } from "@/utils/dates-util";

// constants
import { HTTP_STATUS_CODE } from "@/constants/http";
// import { CAMPAIGN_QUEUE_PREFIX, CAMPAIGN_QUEUE_SESSION_PREFIX } from "@/constants/queues";

// lib
import { api } from "@/lib/axios";

// store
import { useStore } from "@/store/store";

// contexts
// import { CampaignDetailsContext } from "@/contexts/CampaignDetailsContext";

// utils
import { getCampaignResultStatusBadgeStyle, getCampaignContentResultStatusBadgeStyle, getContactStatusBadgeStyle } from "@/utils/badges-util";

// types
type CampaignDetailsCampaignResultProps = {
  result: CampaignResultsProps;
  error?: string;
};

// variables
const barChartConfig = {
  sent: {
    label: "Entregues",
    color: "hsl(var(--chart-success))",
  },
  fails: {
    label: "Falhas",
    color: "hsl(var(--chart-error))",
  },
} satisfies ChartConfig;

const radialChartConfig = {
  remaining: {
    label: "Restantes",
    color: "hsl(var(--chart-warning))",
  },
  sent: {
    label: "Enviados",
    color: "hsl(var(--chart-success))",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  shots: {
    label: "Disparos",
  },
  success: {
    label: "Entregues",
    color: "hsl(var(--chart-success))",
  },
  error: {
    label: "Falhas",
    color: "hsl(var(--chart-error))",
  },
  waiting: {
    label: "Pendentes",
    color: "hsl(var(--chart-warning))",
  },
} satisfies ChartConfig;

const loc = `@/pages/CampaignDetails`;

export default function CampaignDetailsPage() {
  const { toast } = useToast();
  // const { socketIOClient, updateCampaignDetailsWebsocket } = useContext(CampaignDetailsContext);
  const store = useStore();
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<CampaignProps | undefined>(undefined);
  const [sessions, setSessions] = useState<SessionProps[]>([]);
  const [campaignResults, setCampaignResults] = useState<CampaignDetailsCampaignResultProps[]>([]);
  // const [socketIOClient, setSocketIOClient] = useState<Socket | null>(null);
  const sessionCardsRef = useRef(null);
  const [barChartData, setBarChartData] = useState([]);
  const [radialChartData, setRadialChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([
    { status: "success", shots: 0, fill: "var(--color-success)" },
    { status: "error", shots: 0, fill: "var(--color-error)" },
    { status: "waiting", shots: 0, fill: "var(--color-waiting)" },
  ]);

  const tableColumns: ColumnDef<CampaignResultsProps>[] = [
    {
      header: "Foto",
      accessorKey: "profilePicURL",
      cell: ({ row }) => <Avatar className="size-8">{!!row.original.contact?.profilePicURL ? <AvatarImage className="object-cover" src={row.original.contact?.profilePicURL} /> : <AvatarImage className="object-cover" src="/images/placeholders/avatar-placeholder.png" />}</Avatar>,
    },
    {
      header: "Nome",
      accessorKey: "name",
      cell: ({ row }) => <div>{row.original.contact?.profileName || row.original.contact?.name || ""}</div>,
    },
    {
      header: "Telefone",
      accessorKey: "phone",
      cell: ({ row }) => <div>{formatPhoneNumber(row.original.contact?.phone)}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <span className={`rounded-md py-1 px-2 text-center ${getCampaignResultStatusBadgeStyle(row.original.status)}`}>{formatted_campaign_result_status[row.original?.status] || "-"}</span>,
    },
    {
      header: "Entrega",
      accessorKey: "contents.status",
      cell: ({ row }) => (
        <div className="flex gap-x-1">
          {row.original.contents
            ?.sort((a, b) => a.campaignContent.index - b.campaignContent.index)
            .map((c, i) => (
              <div key={i} className={`rounded-md size-7 text-center ${getCampaignContentResultStatusBadgeStyle(c.status)}`}>
                &nbsp;
              </div>
            ))}
        </div>
      ),
    },
    {
      header: "Contato",
      accessorKey: "contactstatus",
      cell: ({ row }) => <span className={`rounded-md py-1 px-2 text-center text-white ${getContactStatusBadgeStyle(row.original?.contact?.status)}`}>{formatted_contact_status[row.original?.contact?.status] || "-"}</span>,
    },
  ];

  async function _fetchCampaignByRef() {
    try {
      setIsLoading(true);

      const response = await api.get("/", {
        params: {
          action: "campaign_by_ref",
          userId: store.user?.id,
          companyId: store.company?.id,
          ref: params.ref,
        },
      });

      if (response.data.statusCode == HTTP_STATUS_CODE.OK) {
        const campaignData: CampaignProps = response.data.body[0];

        // appending campaign content results prototypes
        const contentsAmount = Number(campaignData.contents?.length || 0);
        let incompleteAmount = 0;
        for (let i = 0; i < (campaignData.results || [])?.length; i++) {
          if (Number(campaignData.results?.[i].contents?.length || 0) >= Number(contentsAmount)) continue;

          incompleteAmount = contentsAmount - Number(campaignData.results?.[i].contents?.length || 0);

          for (let j = Number(campaignData.results?.[i].contents?.length || 0); j < contentsAmount; j++) {
            if (!campaignData.results?.[i].contents) campaignData.results[i].contents = [];

            // @ts-ignore
            campaignData.results[i].contents[j] = {
              status: campaign_content_result_status.PENDING,
              // @ts-ignore
              campaignContent: { index: j },
            };
          }
        }

        setCampaign(campaignData);
        const allSessions: SessionProps[] = Array.from(response.data.body[0]?.results?.map((r: CampaignResultsProps) => r.session) || []);
        const distinctSessions: SessionProps[] = [];
        for (let s of allSessions) {
          if (!distinctSessions.some((ds) => ds.ref == s.ref)) distinctSessions.push(s);
        }

        setSessions(distinctSessions);
        setCampaignResults(response.data.body[0]?.results?.map((r: CampaignResultsProps) => ({ result: r })));
      } else {
        setCampaign(undefined);
        toast({ variant: "destructive", title: "Ops ...", description: response.data?.statusMessage || "Não foi possível buscar os dados da campanha." });
        navigate("/campanhas");
      }
    } catch (err) {
      console.error(`Unhandled error at @/pages/CampaingDetails._fetchCampaingByRef function. Details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  /* const _connectWebsockets = async () => {
    if (!socketIOClient) {
      const client = await getSocketIOClient("/campaigns/");
      updateCampaignDetailsWebsocket(client);
      // setSocketIOClient(client);

      if (!client) {
        toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível conectar ao servidor." });
        return;
      }
    }
  }; */

  /*  const _appendWebsocketsListeners = async () => {
    if (!socketIOClient) {
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível conectar ao servidor." });
      return;
    }

    for (let session of sessions) {
      // TODO: talvez passar socket para context, para não se perder nas renderizações
      socketIOClient.on(`${CAMPAIGN_QUEUE_PREFIX}-${campaign?.ref}-${CAMPAIGN_QUEUE_SESSION_PREFIX}${session.ref}`, async (msg: string) => {
        const parsedMsg = JSON.parse(msg || "{}");

        switch (parsedMsg.action) {
          case "refetch":
            setTimeout(async () => await _fetchCampaignByRef(), 1000);
            break;

          case "error":
            toast({ variant: "destructive", title: "Ops ...", description: parsedMsg.message });
            console.error(parsedMsg.details);
            break;

          case "delay":
            sessionCardsRef.current?.updateSessionDelay({ ref: session.ref, delay: parsedMsg.delay });
            break;

          case "remaining_amount":
            sessionCardsRef.current?.updateSessionRemainingAmount({ ref: session.ref, remainingAmount: parsedMsg.remainingAmount });
            break;
        }
      });
    }
  }; */

  const _buildHistoryChart = async () => {
    const groupedData: { [key: string]: CampaignResultsProps[] } = _.groupBy(
      campaignResults.filter((r) => r.result?.createdAt || r.result?.updatedAt).map((r) => r.result),
      (cr: CampaignResultsProps) => format(new Date(cr.updatedAt || cr.createdAt), "HH:mm", { timeZone })
    );

    let data: { date: string; sent: number; fails: number }[] = [];
    let dataIndex: number, sent: number, fails: number;
    for (let [key, values] of Object.entries(groupedData)) {
      dataIndex = data.findIndex((d) => d.date == key);
      sent = values.reduce((total, current) => (total += current.contents?.filter((c) => c.status === campaign_content_result_status.SENT)?.length || 0), 0);
      fails = values.reduce((total, current) => (total += current.contents?.filter((c) => c.status === campaign_content_result_status.FAILED)?.length || 0), 0);
      if (dataIndex == -1) data.push({ date: key, sent, fails });
      else {
        data[dataIndex].sent += sent;
        data[dataIndex].fails += fails;
      }
    }

    setBarChartData(data);
  };

  const _buildRemainingChart = async () => {
    let remaining = 0,
      sent = 0;
    for (let campaignResult of campaignResults.map((r) => r.result)) {
      sent += campaignResult.contents?.filter((c) => c.status != campaign_content_result_status.PENDING)?.length || 0;
      remaining += campaignResult.contents?.filter((c) => c.status === campaign_content_result_status.PENDING)?.length || 0;
    }

    setRadialChartData([{ remaining, sent }]);
  };

  const _buildStatusChart = async () => {
    let data = Array.from(donutChartData);
    for (let campaignContentResult of campaignResults.map((r) => r.result).reduce((total, current) => (total = total.concat(current.contents || [])), [])) {
      switch (campaignContentResult.status) {
        case campaign_content_result_status.SENT:
          data[0].shots += 1;
          break;

        case campaign_content_result_status.FAILED:
          data[1].shots += 1;
          break;

        case campaign_content_result_status.PENDING:
          data[2].shots += 1;
          break;
      }
    }

    setDonutChartData(data);
  };

  useEffect(() => {
    if (!campaign) _fetchCampaignByRef();
  }, [campaign]);

  /*  useEffect(() => {
    if (sessions?.length) {
      if (!socketIOClient) _connectWebsockets();
      else _appendWebsocketsListeners();
    }

    return () => {
      if (socketIOClient) socketIOClient.disconnect();
      updateCampaignDetailsWebsocket(null);
    };
  }, [sessions, socketIOClient]); */

  useEffect(() => {
    if (campaign && sessions?.length && campaignResults?.length) {
      _buildHistoryChart();
      _buildRemainingChart();
      _buildStatusChart();
    }
  }, [campaign, sessions, campaignResults]);

  return (
    <div className="flex flex-col w-full min-h-full gap-y-8 p-8 pb-16 relative py-0">
      {/* SESSIONS CARDS */}
      <CampaignSessionCards ref={sessionCardsRef} campaign={campaign} sessions={sessions} />

      {/* BAR CHART / RADIAL CHART / RADIAL CHART */}
      <div className="w-full flex lgAndDown:flex-wrap justify-between items-start min-h-[502px] gap-4">
        {/* BAR CHART */}
        <div className="min-h-[502px] max-h-[502px] lgAndDown:w-full xlAndUp:w-[calc(74.97%_-_8px)] 2xlAndUp:w-[calc(83.33%_-_8px)]">
          <Card className="bg-background dark:bg-accent border h-[502px]">
            <CardHeader>
              <CardTitle className="text-xl">Histórico</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 items-center pb-0">
              {barChartData?.length && (
                <ChartContainer config={barChartConfig} className="mx-auto aspect-square min-h-[400px] max-h-[400px] w-full">
                  <BarChart accessibilityLayer data={barChartData} barSize={128}>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      // tickFormatter={(value) => format(new Date(value), "HH:mm", { timeZone })}
                    />
                    <Bar dataKey="sent" stackId="a" fill="var(--color-sent)" radius={[16, 16, 16, 16]} />
                    <Bar dataKey="fails" stackId="a" fill="var(--color-fails)" radius={[16, 16, 16, 16]} />
                    {/* <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          className="w-[180px]"
                          formatter={(value, name, item, index) => (
                            <>
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                style={
                                  {
                                    "--color-bg": `var(--color-${name})`,
                                  } as React.CSSProperties
                                }
                              />
                              {barChartConfig[name as keyof typeof barChartConfig]?.label || name}
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">{value}</div>
                            </>
                          )}
                        />
                      }
                      cursor={false}
                      defaultIndex={1}
                    /> */}
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RADIAL CHART / RADIAL CHART */}
        <div className="flex smAndDown:flex-col lg:flex-row md:flex-row xlAndUp:flex-col gap-y-4 md:min-h-[275px] md:max-h-[275px] lg:min-h-[275px] lg:max-h-[275px] xlAndUp:min-h-[502px] xlAndUp:max-h-[502px] lgAndDown:w-full xlAndUp:w-[calc(24.99%_-_8px)] 2xlAndUp:w-[calc(16.66%_-_8px)] gap-4">
          {/* RADIAL CHART */}
          <Card className="bg-background dark:bg-accent border lgAndDown:h-[275px] xlAndUp:h-[227px] mdAndDown:w-full lg:w-[calc(50%_-_8px)] xlAndUp:w-full">
            <CardHeader>
              <CardTitle className="text-xl">Progresso</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 items-center pb-0 lgAndDown:pt-8">
              {radialChartData?.length && (
                <ChartContainer config={radialChartConfig} className="mx-auto aspect-square min-h-[180px] max-h-[180px]">
                  <RadialBarChart data={radialChartData} endAngle={180} innerRadius={80} outerRadius={130}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-[180px]" />} />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                                  {campaignResults.reduce((total, current) => (total += current.result?.contents?.filter((c) => c.status != campaign_content_result_status.PENDING)?.length || 0), 0) || 0}/
                                  {campaignResults.reduce((total, current) => (total += current.result?.contents?.length || 0), 0) || 0}
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                                  Total
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                    <RadialBar dataKey="remaining" stackId="a" cornerRadius={5} fill="var(--color-remaining)" className="stroke-transparent stroke-2" />
                    <RadialBar dataKey="sent" fill="var(--color-sent)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
                  </RadialBarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* RADIAL CHART */}
          <Card className="bg-background dark:bg-accent border h-[275px] mdAndDown:w-full lg:w-[calc(50%_-_8px)] xlAndUp:w-full">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Status</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
              {donutChartData?.length && (
                <ChartContainer config={donutChartConfig} className="mx-auto aspect-square min-h-[200px] max-h-[200px]">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-[180px]" />} />
                    <Pie data={donutChartData} dataKey="shots" nameKey="status" innerRadius={55} strokeWidth={5}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                  {campaignResults.reduce((total, current) => (total += current.result.contents?.filter((c) => c.status != campaign_content_result_status.PENDING)?.length || 0), 0) || 0}
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                  Disparados
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <CustomDataTable columns={tableColumns} data={campaignResults.map((cr) => cr.result)} hideFilterInput={true} />
      </div>
    </div>
  );
}
