// packages
import {
  LuPieChart,
  LuQrCode,
  LuContact2,
  LuFlame,
  LuNetwork,
  LuWorkflow,
  LuMessagesSquare,
  LuBellRing,
  LuSettings,
} from "react-icons/lu";

// types
import { RouteProps } from "@/types/routes-types";

// pages
import Home from "@/pages/Home";
import Sessions from "@/pages/Sessions";
import Campaigns from "@/pages/Campaigns";
import CampaignDetails from '@/pages/CampaignDetails'

export const routes: RouteProps[] = [
  {
    name: "Home",
    path: "/home",
    icon: LuPieChart,
    category: "page",
    component: Home,
    disabled: () => true,
    showOnHome: () => false,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Sessões",
    path: "/sessoes",
    icon: LuQrCode,
    description: ``,
    category: "page",
    component: Sessions,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Contatos",
    path: "/contatos",
    icon: LuContact2,
    description: ``,
    category: "page",
    disabled: () => true,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Campanhas",
    path: "/campanhas",
    icon: LuWorkflow,
    category: "service",
    description: ``,
    component: Campaigns,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Detalhes",
    path: "/campanhas/:ref/detalhes",
    icon: LuWorkflow,
    category: "service",
    description: ``,
    component: CampaignDetails,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false,
  },
  {
    name: "Funis",
    path: "/funis",
    icon: LuNetwork,
    category: "service",
    description: ``,
    disabled: () => true,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Aquecimento",
    path: "/aquecimento",
    icon: LuFlame,
    category: "service",
    description: ``,
    disabled: () => true,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Atendimentos",
    path: "/atendimentos",
    icon: LuMessagesSquare,
    category: "service",
    description: ``,
    disabled: () => true,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false,
  },
  {
    name: "Notificações",
    path: "/notificacoes",
    icon: LuBellRing,
    category: "page",
    disabled: () => true,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => true,
  },
  // {
  //   name: 'Configurações',
  //   path: '/configuracoes',
  //   icon: LuSettings,
  //   category: 'page',
  //   disabled: () => false,
  //   showOnHome: () => false,
  //   showOnSideDrawer: () => false,
  //   showOnTopbar: () => true
  // }
];
