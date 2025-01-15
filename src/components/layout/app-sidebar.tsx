// packages
import { Fragment, useContext } from "react";
import { Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// components
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// hooks
import { useMediaQuery } from "@/hooks/use-media-query";

// contexts
import { StoreContext } from "@/contexts/StoreContext";

// utils
import { routes } from "@/utils/routes-util";

// styles
import "@/styles/animations/animations.css";

// store
import { useStore } from "@/store/store";

export function AppSidebar() {
  const navigate = useNavigate();
  const { activeRoute } = useContext(StoreContext);
  const { logout } = useStore();
  const isMobile = useMediaQuery("(max-width:767px)");

  const routesGroupedByTopic = routes
    .filter((r) => r.showOnSideDrawer && r.showOnSideDrawer())
    .reduce((total, current) => {
      if (!current.group) {
        if (!total["Páginas"]) total["Páginas"] = [];
        total["Páginas"].push(current);
      } else {
        if (!total[current.group]) total[current.group] = [];

        total[current.group].push(current);
      }

      return total;
    }, {});

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isMobile ? undefined : "none"} className="min-h-screen overflow-y-auto dark:bg-gray-900 border-r !max-w-[220px] !min-w-[220px] fixed">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex w-full align-center items-center justify-between">
            <img src={`/images/logos/logo.svg`} alt="Logo" width={300} className="mx-auto -mt-12 -mb-16" />
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-2 mt-8">
            <span className="font-bold text-primary-foreground text-md">JOGADOR:</span>
            <span className="font-bold text-primary-foreground text-sm">Usuário 1</span>
          </div>

          <div className="rounded-lg bg-primary/50 w-full p-4 flex flex-col gap-y-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex-grow flex flex-col items-start justify-start gap-2">
                <span className="font-bold text-primary-foreground text-md">R$ 0,00</span>
                <span className="font-bold text-primary-foreground text-xs">Meu Saldo</span>
              </div>

              <div className="flex items-center justify-center h-full">
                <Wallet className="size-8" />
              </div>
            </div>

            <Button variant="default" className="w-full bg-success hover:bg-success hover:brightness-125 smalltobig" size="sm" onClick={() => navigate("/depositar")}>
              Depositar
            </Button>
          </div>
        </SidebarHeader>

        <SidebarGroup>
          {Object.entries(routesGroupedByTopic).map(([group, routes], i) => (
            <Fragment key={i}>
              <SidebarGroupLabel className={i === 0 ? "" : "mt-2 pt-2 border-t rounded-none"}>{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {routes.map((route, j) => (
                    <SidebarMenuItem key={j}>
                      <SidebarMenuButton asChild>
                        <a
                          href={route.disabled && route.disabled() ? null : route.path}
                          className={`rounded-lg pr-2 flex w-[calc(100% - 8px)] hover:cursor-pointer hover:bg-primary dark:hover:bg-accent hover:bg-opacity-10 hover:text-accent dark:hover:text-foreground group ${activeRoute === route.path && "bg-primary dark:bg-accent"} ${
                            activeRoute === route.path && route.highlight && "bg-primary/30 dark:bg-primary/30"
                          } ${route.disabled && route.disabled() ? "opacity-50 hover:!cursor-not-allowed hover:!bg-primary/30 dark:hover:!bg-accent/30" : ""} ${route.highlight ? "bg-primary text-primary-foreground smalltobig hover:!bg-primary hover:brightness-125" : ""}`}
                        >
                          <Avatar className="p-3">
                            <route.icon className={`size-4 ${activeRoute === route.path && "text-accent dark:text-foreground"}`} />
                          </Avatar>
                          <span className={`truncate text-sm group-hover:text-accent dark:group-hover:text-foreground ${activeRoute === route.path ? "text-accent dark:text-foreground" : "text-foreground"}`}>{route.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </Fragment>
          ))}
        </SidebarGroup>

        <SidebarFooter className="absolute bottom-0 w-full flex items-center justify-center pb-4">
          <Button variant="default" className="bg-red-500 hover:bg-red-500 hover:brightness-125 flex items-center gap-2 px-8 mt-4" size="sm" onClick={logout}>
            Sair
            <LogOut className="size-4 text-primary-foreground" />
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
