// packages
import { useEffect, useState } from "react";
import { PiUserMinusLight, PiUserPlus, PiUsersThree } from "react-icons/pi";
import { LuQrCode, LuContact2, LuWorkflow } from "react-icons/lu";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

// components
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import PieChartComponent from "@/components/charts/pie-chart";
import BarChartComponent from "@/components/charts/bar-chart";
import { DatePicker } from "@/components/dates/date-picker";

// lib
import { api } from "@/lib/axios";

// store
import { useStore } from "@/store/store";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const pieData = [
  { name: "Entregues", value: 1200 },
  { name: "Falha", value: 860 },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: "Entregues",
    color: "#15803d",
  },
  mobile: {
    label: "Falha",
    color: "#b91c1c",
  },
};

const COLORS = ["#15803d", "#b91c1c"];

export default function Home() {
  const store = useStore();
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ status: undefined });

  const navigate = useNavigate();
  useEffect(() => {
    navigate("/sessoes");
  }, []);

  return (
    <>
      <div className="lg:flex w-full space-y-2 lg:space-y-0 lg:justify-between p-8">
        <Card className="min-w-80 lg:w-[calc(33.3%_-_16px)] bg-zinc-300/60 dark:bg-zinc-700/60 ring ring-offset-0 ring-zinc-400 hover:shadow-lg hover:shadow-zinc-400 flex flex-col items-center justify-between">
          <CardHeader>
            <CardTitle className="bg-zinc-700 p-2 rounded-full">
              <LuQrCode className="size-8" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <span className="font-semibold text-xxl">0</span>
          </CardContent>

          <CardFooter>
            <CardDescription className="text-xl">Sessões</CardDescription>
          </CardFooter>
        </Card>

        <Card className="min-w-80 lg:w-[calc(33.3%_-_16px)] bg-zinc-300/60 dark:bg-zinc-700/60 ring ring-offset-0 ring-zinc-400 hover:shadow-lg hover:shadow-zinc-400 flex flex-col items-center justify-between">
          <CardHeader>
            <CardTitle className="bg-zinc-700 p-2 rounded-full">
              <LuContact2 className="size-8" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <span className="font-semibold text-xxl">0</span>
          </CardContent>

          <CardFooter>
            <CardDescription className="text-xl">Contatos</CardDescription>
          </CardFooter>
        </Card>

        <Card className="min-w-80 lg:w-[calc(33.3%_-_16px)] bg-zinc-300/60 dark:bg-zinc-700/60 ring ring-offset-0 ring-zinc-400 hover:shadow-lg hover:shadow-zinc-400 flex flex-col items-center justify-between">
          <CardHeader>
            <CardTitle className="bg-zinc-700 p-2 rounded-full">
              <LuWorkflow className="size-8" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            <span className="font-semibold text-xxl">0</span>
          </CardContent>

          <CardFooter>
            <CardDescription className="text-xl">Campanhas</CardDescription>
          </CardFooter>
        </Card>
      </div>

      <div className="px-8 lg:flex lg:space-y-0 justify-between items-center">
        <div className="md:max-w-auto flex gap-x-4">
          <button
            className={`p-2 rounded-xl text-sm ${selectedFilters.status === "PROCESSING" ? `bg-yellow-700` : `bg-zinc-700`}`}
            onClick={() =>
              setSelectedFilters(
                Object.assign({}, selectedFilters, {
                  status: selectedFilters.status === "PROCESSING" ? undefined : "PROCESSING",
                })
              )
            }
          >
            Ativas
          </button>

          <button
            className={`p-2 rounded-xl text-sm ${selectedFilters.status === "DONE" ? `bg-green-700` : `bg-zinc-700`}`}
            onClick={() =>
              setSelectedFilters(
                Object.assign({}, selectedFilters, {
                  status: selectedFilters.status === "DONE" ? undefined : "DONE",
                })
              )
            }
          >
            Finalizadas
          </button>

          <button
            className={`p-2 rounded-xl text-sm ${selectedFilters.status === "CANCELED" ? `bg-red-700` : `bg-zinc-700`}`}
            onClick={() =>
              setSelectedFilters(
                Object.assign({}, selectedFilters, {
                  status: selectedFilters.status === "CANCELED" ? undefined : "CANCELED",
                })
              )
            }
          >
            Canceladas
          </button>
        </div>

        <div className="md:flex md:justify-end gap-2 space-y-2 md:space-y-0 w-auto">
          <div className="md:max-w-44">
            <span className="text-sm">Data Inicial</span>
            <DatePicker onChange={setStartDate} selected={startDate} />
          </div>

          <div className="md:max-w-44">
            <span className="text-sm">Data Final</span>
            <DatePicker onChange={setEndDate} selected={endDate} minDate={startDate} />
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="lg:flex lg:flex-1 lg:gap-4 rounded-lg w-[calc(100%_-_64px)] ml-8 mt-8 pb-8">
        <div className="w-full bg-zinc-700/30 p-8 rounded-lg">
          <div className="flex justify-between p-2 items-baseline">
            <h2 className="font-semibold text-lg">Disparos</h2>
            <span className="text-sm">Total: 0</span>
          </div>
          <BarChartComponent chartConfig={chartConfig} chartData={chartData} colors={COLORS} dataKey="month" barDataKeys={["desktop", "mobile"]} />
        </div>

        <div className="w-full bg-zinc-700/30 p-8 rounded-lg">
          <div className="flex justify-between p-2 items-baseline">
            <h2 className="font-semibold text-lg">Status</h2>
            <span className="text-sm">Total: 0</span>
          </div>
          <PieChartComponent chartConfig={chartConfig} colors={COLORS} pieData={pieData} />
        </div>
      </div>
    </>
  );
}
