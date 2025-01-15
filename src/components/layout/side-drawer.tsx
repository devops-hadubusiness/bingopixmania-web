// package
import React, { useContext } from "react";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

// components
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// utils
import { routes } from "@/utils/routes-util";

// contexts
import { StoreContext } from "@/contexts/StoreContext";
import { ThemeContext } from "@/contexts/ThemeContext";

// types
import { RouteProps } from "@/types/routes-types";

export default function SideDrawer(): JSX.Element {
  const { activeRoute, isDrawerExpanded, setIsDrawerExpanded, isDrawerOpen, setIsDrawerOpen } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const isMobile = true// useMediaQuery("(max-width:767px)");
  const lgAndDown = true//useMediaQuery("(max-width: 1279px)");

  const _getFullItem = (route: RouteProps): JSX.Element => {
    return (
      <AccordionItem value={route.path} className="max-w-[100%] m-0 px-2 border-none">
        {route.children?.length ? (
          <AccordionItem value={route.path} className={`border-none shadow-none rounded-lg data-[state=open]:bg-accent ${activeRoute === route.path && "bg-accent"}`}>
            <AccordionTrigger className={`truncate m-0 hover:no-underline hover:cursor-pointer max-h-[40px] max-w-[100%] pr-2 rounded-lg ${activeRoute !== route.path && "hover:bg-accent"}`}>
              <div className={`rounded-lg pr-2 flex w-full`}>
                <Avatar className="p-3">
                  <route.icon />
                </Avatar>

                <span className="truncate text-sm text-foreground mt-3 ml-1">{route.name}</span>
              </div>
            </AccordionTrigger>

            {route.children.map((c, i) => (
              <AccordionContent key={i} className={`rounded-lg hover:cursor-pointer max-h-[40px] ${activeRoute !== c.path && "hover:bg-accent"}`}>
                <a href={c.disabled && c.disabled() ? "#" : c.path} className="flex w-full">
                  <Avatar className="p-3">
                    <c.icon />
                  </Avatar>

                  <span className="truncate text-sm text-foreground mt-3 ml-1">{c.name}</span>
                </a>
              </AccordionContent>
            ))}
          </AccordionItem>
        ) : (
          <a
            href={route.disabled && route.disabled() ? "#" : route.path}
            className={`rounded-lg pr-2 flex w-[calc(100% - 8px)] hover:cursor-pointer hover:bg-primary dark:hover:bg-accent hover:bg-opacity-10 hover:text-accent dark:hover:text-foreground group ${activeRoute === route.path && "bg-primary dark:bg-accent"}`}
          >
            <Avatar className="p-3">
              <route.icon className={`size-5 ${activeRoute === route.path && "text-accent dark:text-foreground"}`} />
            </Avatar>
            <span className={`truncate text-sm mt-3 ml-1 group-hover:text-accent dark:group-hover:text-foreground ${activeRoute === route.path ? "text-accent dark:text-foreground" : "text-foreground"}`}>{route.name}</span>
          </a>
        )}
      </AccordionItem>
    );
  };

  const _getIconItem = (route: RouteProps): JSX.Element => {
    return (
      <a href={route.disabled && route.disabled() ? "#" : route.path} className={`icon-item mx-2 rounded-lg pr-2 flex w-[calc(100% - 8px)] hover:cursor-pointer hover:bg-primary dark:hover:bg-accent hover:bg-opacity-10 group ${activeRoute === route.path && "bg-primary dark:bg-accent"}`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger className="m-auto icon-item">
              <Avatar className="p-3 hover:cursor-pointer m-auto icon-item">
                <route.icon className={`icon-item ${activeRoute === route.path ? "text-accent dark:text-foreground" : "group-hover:text-accent group-hover:dark:text-foreground"}`} />
              </Avatar>
            </TooltipTrigger>

            <TooltipContent side="right" className="bg-accent rounded-lg border-border py-1 icon-item">
              <span className="text-xs text-foreground icon-item">{route.name}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </a>
    );
  };

  function _drawerClicked(evt: any) {
    if (isMobile) {
      if (evt.target?.classList?.contains("bg-black/80")) setIsDrawerOpen(false);
      return;
    }

    if (evt.target?.dataset?.role === "close" && isDrawerExpanded) setIsDrawerExpanded(false);
    else if (!isDrawerExpanded && !lgAndDown) {
      if (!["svg", "path", "rect"].includes(evt.target.tagName) && !evt.target.classList.contains("icon-item")) setIsDrawerExpanded(true);
    }
  }

  return (
    <div onClick={(evt) => _drawerClicked(evt)}>
      <Drawer fixed direction="left" open={isMobile ? isDrawerOpen : true} dismissible={isMobile} modal={isMobile} shouldScaleBackground={true} onClose={() => setIsDrawerOpen(false)}>
        <DrawerContent
          className={`h-full w-[56px] border-r-1 border-b-0 border-border bg-background dark:bg-gray-900 rounded-none shadow-none pb-6 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-r-1 focus-visible:border-b-0 focus-visible:outline-none ${
            isDrawerExpanded ? "w-[auto] max-w-[255px] overflow-y-auto" : ""
          }`}
        >
          <DrawerHeader className="flex align-center justify-center pt-4 mt-[7px] border-b border-border">
            <DrawerTitle className="flex justify-between align-center w-full" style={{ marginTop: "-6px" }}>
              {isDrawerExpanded ? (
                <div className="flex w-full align-center items-center justify-between">
                  <img src={`/images/logos/logo-${theme}.svg`} alt="Logo" width={150} height={150} className="mx-auto" />

                  <Avatar className={`p-3 ${isMobile ? "disabled opacity-0" : "hover:cursor-pointer hover:bg-accent"}`} data-role="close">
                    <ChevronLeft className="size-4" data-role="close" />
                  </Avatar>
                </div>
              ) : (
                <Avatar className="p-1 hover:cursor-pointer -ml-2">
                  <AvatarImage src={`/images/logos/logo-icon-${theme}.svg`} />
                  <AvatarFallback>...</AvatarFallback>
                </Avatar>
              )}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col w-full h-auto mt-4">
            <Accordion type="single" collapsible className="flex flex-col gap-1">
              {routes
                .filter((r) => r.showOnSideDrawer && r.showOnSideDrawer())
                .map((r, i) => (
                  <React.Fragment key={i}>{isDrawerExpanded ? _getFullItem(r) : _getIconItem(r)}</React.Fragment>
                ))}
            </Accordion>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
