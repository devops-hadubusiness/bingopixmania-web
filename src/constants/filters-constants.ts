// packages
import { startOfToday, endOfToday, startOfYesterday, endOfYesterday, startOfWeek, endOfWeek, subWeeks, subMonths, startOfMonth, endOfMonth } from "date-fns";

// variables
export const DDDs = [
  {
    key: "11",
    value: "11",
  },
  {
    key: "12",
    value: "12",
  },
  {
    key: "13",
    value: "13",
  },
  {
    key: "14",
    value: "14",
  },
  {
    key: "15",
    value: "15",
  },
  {
    key: "16",
    value: "16",
  },
  {
    key: "17",
    value: "17",
  },
  {
    key: "18",
    value: "18",
  },
  {
    key: "19",
    value: "19",
  },
  {
    key: "21",
    value: "21",
  },
  {
    key: "22",
    value: "22",
  },
  {
    key: "24",
    value: "24",
  },
  {
    key: "27",
    value: "27",
  },
  {
    key: "28",
    value: "28",
  },
  {
    key: "31",
    value: "31",
  },
  {
    key: "32",
    value: "32",
  },
  {
    key: "33",
    value: "33",
  },
  {
    key: "34",
    value: "34",
  },
  {
    key: "35",
    value: "35",
  },
  {
    key: "37",
    value: "37",
  },
  {
    key: "38",
    value: "38",
  },
  {
    key: "41",
    value: "41",
  },
  {
    key: "42",
    value: "42",
  },
  {
    key: "43",
    value: "43",
  },
  {
    key: "44",
    value: "44",
  },
  {
    key: "45",
    value: "45",
  },
  {
    key: "46",
    value: "46",
  },
  {
    key: "47",
    value: "47",
  },
  {
    key: "48",
    value: "48",
  },
  {
    key: "49",
    value: "49",
  },
  {
    key: "51",
    value: "51",
  },
  {
    key: "53",
    value: "53",
  },
  {
    key: "54",
    value: "54",
  },
  {
    key: "55",
    value: "55",
  },
  {
    key: "61",
    value: "61",
  },
  {
    key: "62",
    value: "62",
  },
  {
    key: "63",
    value: "63",
  },
  {
    key: "64",
    value: "64",
  },
  {
    key: "65",
    value: "65",
  },
  {
    key: "66",
    value: "66",
  },
  {
    key: "67",
    value: "67",
  },
  {
    key: "68",
    value: "68",
  },
  {
    key: "69",
    value: "69",
  },
  {
    key: "71",
    value: "71",
  },
  {
    key: "73",
    value: "73",
  },
  {
    key: "74",
    value: "74",
  },
  {
    key: "75",
    value: "75",
  },
  {
    key: "77",
    value: "77",
  },
  {
    key: "79",
    value: "79",
  },
  {
    key: "81",
    value: "81",
  },
  {
    key: "82",
    value: "82",
  },
  {
    key: "83",
    value: "83",
  },
  {
    key: "84",
    value: "84",
  },
  {
    key: "85",
    value: "85",
  },
  {
    key: "86",
    value: "86",
  },
  {
    key: "87",
    value: "87",
  },
  {
    key: "88",
    value: "88",
  },
  {
    key: "89",
    value: "89",
  },
  {
    key: "91",
    value: "91",
  },
  {
    key: "92",
    value: "92",
  },
  {
    key: "93",
    value: "93",
  },
  {
    key: "94",
    value: "94",
  },
  {
    key: "95",
    value: "95",
  },
  {
    key: "96",
    value: "96",
  },
  {
    key: "97",
    value: "97",
  },
  {
    key: "98",
    value: "98",
  },
  {
    key: "99",
    value: "99",
  },
];

export const THEME_FILTER_ITEMS = [
  {
    key: "light",
    color: "#2B2B2B",
  },
  {
    key: "custom1",
    color: "#286602",
  },
  {
    key: "custom2",
    color: "#328A87",
  },
  {
    key: "custom3",
    color: "#026664",
  },
  {
    key: "custom4",
    color: "#025566",
  },
  {
    key: "custom5",
    color: "#2DABAD",
  },
  {
    key: "custom6",
    color: "#023266",
  },
  {
    key: "custom7",
    color: "#812691",
  },
  {
    key: "custom8",
    color: "#480266",
  },
  {
    key: "custom9",
    color: "#100C87",
  },
  {
    key: "custom10",
    color: "#66025A",
  },
  {
    key: "custom11",
    color: "#CF4242",
  },
  {
    key: "custom12",
    color: "#A31826",
  },
  {
    key: "custom13",
    color: "#872020",
  },
  {
    key: "custom14",
    color: "#660502",
  },
  {
    key: "custom15",
    color: "#575640",
  },
  {
    key: "custom16",
    color: "#544522",
  },
  {
    key: "custom17",
    color: "#807A60",
  },
  {
    key: "custom18",
    color: "#B54414",
  },
  {
    key: "custom19",
    color: "#363435",
  },
  {
    key: "custom20",
    color: "#B5B467",
  },
  {
    key: "custom21",
    color: "#D1CE17",
  },
  {
    key: "custom22",
    color: "#A3A13B",
  },
  {
    key: "custom23",
    color: "#665702",
  },
  {
    key: "custom24",
    color: "#19191A",
  },
];

export const PERIOD_FILTER_ITEMS = [
  {
    key: "today",
    text: "Hoje",
    startDate: startOfToday(),
    endDate: endOfToday(),
  },
  {
    key: "yesterday",
    text: "Ontem",
    startDate: startOfYesterday(),
    endDate: endOfYesterday(),
  },
  {
    key: "this-week",
    text: "Essa Semana",
    startDate: startOfWeek(new Date()),
    endDate: endOfToday(),
  },
  {
    key: "last-week",
    text: "Semana Passada",
    startDate: startOfWeek(subWeeks(new Date(), 1)),
    endDate: endOfWeek(subWeeks(new Date(), 1)),
  },
  {
    key: "this-month",
    text: "Esse Mês",
    startDate: startOfMonth(new Date()),
    endDate: endOfToday(),
  },
  {
    key: "last-month",
    text: "Mês Passado",
    startDate: startOfMonth(subMonths(new Date(), 1)),
    endDate: endOfMonth(subMonths(new Date(), 1)),
  },
  {
    key: "three-months",
    text: "3 Meses",
    startDate: startOfMonth(subMonths(new Date(), 3)),
    endDate: endOfToday(),
  },
  {
    key: "six-months",
    text: "6 Meses",
    startDate: startOfMonth(subMonths(new Date(), 6)),
    endDate: endOfToday(),
  },
  {
    key: "all",
    text: "Total",
    startDate: new Date("1900-01-01"),
    endDate: endOfToday(),
  },
  {
    key: "other",
    text: "Outro",
    startDate: undefined,
    endDate: undefined,
  },
];