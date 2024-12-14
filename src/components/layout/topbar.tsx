// packages
import React, { useEffect, useState, useContext, Fragment } from "react";
import { CircleUserRound, LogOut } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

// components
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// contexts
import { StoreContext } from "@/contexts/StoreContext";

// utils
import { routes } from "@/utils/routes-util";
import { isUUID } from "@/utils/uuids-util";

// store
import { useStore } from "@/store/store";

// types
type BreadcrumbItemProps = { name: string; path: string };

export default function Topbar(): JSX.Element {
  const { activeRoute } = useContext(StoreContext);
  const { user, logout } = useStore();
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps[]>([]);
  const isMobile = useMediaQuery("(max-width:767px)");

  const _formatPathname = (pathname: string): BreadcrumbItemProps[] => {
    const paths = pathname
      .split("/")
      .map((p) => {
        let name = String(p).charAt(0).toUpperCase() + String(p).slice(1);
        return {
          name: isUUID(name)
            ? ""
            : name
                .split("-")
                .filter(Boolean)
                .reduce((total, current) => (total += ` ${current.charAt(0).toUpperCase() + current.slice(1)}`), ""),
          path: pathname.substring(0, pathname.indexOf(p) + p.length),
        };
      })
      .filter((p) => !!p.name);

    if (paths?.at(0)?.path === "/home") return paths;
    return [{ name: "Home", path: "/home" }].concat(paths);
  };

  useEffect(() => {
    setBreadcrumb(_formatPathname(activeRoute));
  }, [activeRoute]);

  return (
    <Menubar className={`border-t-0 border-x-0 border-b-1 border-border rounded-none h-[75px] flex align-center justify-between px-12 shadow-soft bg-background dark:bg-gray-900 fixed top-0 ${isMobile ? "!w-full left-0" : "!w-[calc(100%_-_220px)] left-[220px]"}`}>
      {isMobile && <SidebarTrigger />}

      <div className="flex">
        <Breadcrumb className="smAndDown:hidden">
          <BreadcrumbList>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem className={`${i == breadcrumb.length - 1 && "font-semibold text-primary-text"}`}>
                  <BreadcrumbLink href={b.path}>{b.name}</BreadcrumbLink>
                </BreadcrumbItem>
                {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="smAndDown:hidden flex items-center justify-center h-full gap-2">
        {routes
          .filter((r) => r.showOnTopbar && r.showOnTopbar())
          .map((r, i) => (
            <Fragment key={i}>
              {r.button ? (
                <Button variant="default" className="bg-success hover:bg-success hover:brightness-125 animate-bounce flex items-center gap-2" disabled={r.disabled && r.disabled()}>
                  {r.name}
                  {r.icon ? <r.icon className="size-5" color={r.icon.color} /> : null}
                </Button>
              ) : (
                <a href={r.disabled && r.disabled() ? "" : r.path || "#"} className={`flex ${r.disabled && r.disabled() ? "disabled hover:cursor-not-allowed" : ""}`}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger className="m-auto">
                        <Avatar className={`bg-accent p-3 ${r.disabled && r.disabled() ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}`}>{r.icon ? <r.icon color={r.icon.color} /> : <AvatarFallback className="text-foreground">{r.name?.charAt(0)}</AvatarFallback>}</Avatar>
                      </TooltipTrigger>

                      <TooltipContent className="bg-accent rounded-lg border-border py-1">
                        <span className="text-xs text-foreground">{r.name}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
              )}
            </Fragment>
          ))}
      </div>

      <div className="flex h-full space-x-2">
        <div className="flex flex-col align-center justify-center text-end">
          <span className="text-xs text-foreground">Bem-vindo</span>
          <span className="text-sm text-primary-text">{user?.name}</span>
        </div>

        <MenubarMenu>
          <MenubarTrigger>
            <Avatar className={`bg-accent p-3 hover:cursor-pointer`}>
              <CircleUserRound className="size-4" />
            </Avatar>
          </MenubarTrigger>

          <MenubarContent className="border-border shadow-lg p-0 rounded-lg -mt-3 mr-1 dark:bg-gray-900">
            <MenubarItem className="flex p-4 hover:cursor-pointer" onClick={logout}>
              <LogOut className="size-4" />
              <span className="text-xs ml-2">Sair</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
    </Menubar>
  );
}
