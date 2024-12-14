// packages
import { Fragment, useContext } from "react";

// components
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";

// hooks
import { useMediaQuery } from "@/hooks/use-media-query";

// contexts
import { StoreContext } from "@/contexts/StoreContext";

// utils
import { routes } from "@/utils/routes-util";

export function AppSidebar() {
  const { activeRoute } = useContext(StoreContext);
  const isMobile = useMediaQuery("(max-width:767px)");

  const routesGroupedByTopic = routes.filter(r => r.showOnSideDrawer && r.showOnSideDrawer()).reduce((total, current) => {
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
    <Sidebar side="left" variant="sidebar" collapsible={isMobile ? undefined : "none"} className="min-h-screen overflow-y-auto dark:bg-gray-900 border-r !max-w-[220px] !min-w-[220px]">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex w-full align-center items-center justify-between">
            <img src={`/images/logos/logo.svg`} alt="Logo" width={300} className="mx-auto -mt-12 -mb-16" />
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
                            route.disabled && route.disabled() ? "opacity-50 hover:!cursor-not-allowed hover:!bg-primary/30 dark:hover:!bg-accent/30" : ""
                          }`}
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
      </SidebarContent>
    </Sidebar>
  );
}
