// packages
import React, { useEffect, useState, useContext } from "react";
import { CircleUserRound, Settings, KeyRound, LogOut, Menu } from "lucide-react";
import { useMediaQuery } from "@mui/material";

// components
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ThemeToggle from "@/components/layout/theme-toggle";

// contexts
import { StoreContext } from "@/contexts/StoreContext";

// utils
import { routes } from "@/utils/routes-util";
import { isUUID } from "@/utils/uuids-util";

// store
import { useStore } from "@/store/store";

// types
type BreadcrumbItemProps = { name: string; path: string };
type TopbarStyleProps = { width: string; marginLeft: string };

export default function Topbar(): JSX.Element {
  const { isDrawerExpanded, activeRoute, setIsDrawerOpen } = useContext(StoreContext);
  const { user, company, logout } = useStore();
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps[]>([]);
  const isMobile = true; // useMediaQuery('(max-width:767px)')

  const _getTopbarStyle = (): TopbarStyleProps => {
    return {
      width: isMobile ? "100%" : isDrawerExpanded ? "calc(100% - 255px)" : "calc(100% - 56px)",
      marginLeft: isMobile ? "0px" : isDrawerExpanded ? "255px" : "56px",
    };
  };

  const [topbarStyle, setTopbarStyle] = useState<TopbarStyleProps>(_getTopbarStyle());

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

  useEffect(() => setTopbarStyle(_getTopbarStyle), [isDrawerExpanded, isMobile]);

  return (
    <Menubar style={topbarStyle} className={`border-t-0 border-x-0 border-b-1 border-border rounded-none h-[75px] flex align-center justify-between px-12 shadow-soft bg-background dark:bg-gray-900`}>
      {/* {isMobile && <Menu className="mdAndUp:hidden size-5 hover:cursor-pointer" onClick={() => setIsDrawerOpen(true)} />} */}

      {/* TODO: remover essa div e esse menu quando arrumar o drawer, deixar apenas o breadcrumb */}
      <div className="flex">
        <Menu className="size-5 hover:cursor-pointer mr-8" onClick={() => setIsDrawerOpen(true)} />

        <Breadcrumb className="smAndDown:hidden">
          <BreadcrumbList>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem className={`${i == breadcrumb.length - 1 && "font-semibold text-primary"}`}>
                  <BreadcrumbLink href={b.path}>{b.name}</BreadcrumbLink>
                </BreadcrumbItem>
                {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="smAndDown:hidden flex h-full gap-2">
        {routes
          .filter((r) => r.showOnTopbar && r.showOnTopbar())
          .map((r, i) => (
            <a key={i} href={r.disabled && r.disabled() ? "" : r.path || "#"} className={`flex ${r.disabled && r.disabled() ? "disabled hover:cursor-not-allowed" : ""}`}>
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
          ))}
      </div>

      <div className="flex h-full space-x-2">
        <div className="flex flex-col align-center justify-center text-end">
          <span className="text-xs text-foreground">Bem-vindo</span>
          <span className="text-sm text-primary">{user?.name}</span>
        </div>

        <MenubarMenu>
          <MenubarTrigger>
            <Avatar className={`bg-accent p-3 hover:cursor-pointer`}>
              <CircleUserRound className="size-4" />
            </Avatar>
          </MenubarTrigger>

          <MenubarContent className="border-border shadow-lg p-0 rounded-lg -mt-3 mr-1 dark:bg-gray-900">
            <div className="flex items-center justify-center w-[calc(100%_-_16px)] mt-2 mx-auto p-4 hover:cursor-pointer px-4 py-1 rounded-md bg-primary">
              <span className="text-sm text-white">{company?.name}</span>
            </div>

            <div className="flex items-center justify-center w-[calc(100%_-_16px)] mt-2 mx-auto p-4 hover:cursor-pointer px-4 py-1 rounded-md">
              <ThemeToggle />
            </div>

            <MenubarItem className="flex p-4 hover:cursor-not-allowed disabled opacity-50">
              <Settings className="size-4 disabled" />
              <span className="text-xs ml-2">Configurações</span>
            </MenubarItem>

            <MenubarItem className="flex p-4 hover:cursor-pointer hover:cursor-not-allowed disabled opacity-50">
              <KeyRound className="size-4 disabled" />
              <span className="text-xs ml-2">Alterar Senha</span>
            </MenubarItem>

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
