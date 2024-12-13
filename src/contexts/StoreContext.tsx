// packages
import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

// types
type ContainerStyleProps = { width: string; marginLeft: string; minHeight: string };

// interfaces
interface IStoreContext {
  activeRoute: string;
  isDrawerExpanded: boolean;
  setIsDrawerExpanded: (expanded: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  containerStyle: ContainerStyleProps;
}

const StoreContext = createContext<IStoreContext>({
  activeRoute: "",
  isDrawerExpanded: Boolean(localStorage.getItem("isDrawerExpanded") ?? true),
  setIsDrawerExpanded: () => false,
  isDrawerOpen: false,
  setIsDrawerOpen: () => false,
  containerStyle: {
    width: "calc(100% - 56px)",
    marginLeft: "56px",
    minHeight: "calc(100vh - 75px)",
  },
});

const StoreProvider = ({ children }: { children: Readonly<React.ReactNode> }) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width:767px)");
  const lgAndDown = useMediaQuery("(max-width: 1279px)");
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(localStorage.getItem("isDrawerExpanded") === "false" ? false : true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("");

  const _getContainerStyle = (): ContainerStyleProps => {
    // TODO: remover quando arrumar o drawer
    return {
      width: "100%",
      marginLeft: "0px",
      minHeight: "calc(100vh - 75px)",
    };

    if (lgAndDown && !isMobile) {
      return {
        width: "calc(100% - 56px)",
        marginLeft: "56px",
        minHeight: "calc(100vh - 75px)",
      };
    }

    return {
      width: isMobile ? "100%" : isDrawerExpanded ? "calc(100% - 255px)" : "calc(100% - 56px)",
      marginLeft: isMobile ? "0px" : isDrawerExpanded ? "255px" : "56px",
      minHeight: "calc(100vh - 75px)",
    };
  };

  const [containerStyle, setContainerStyle] = useState<ContainerStyleProps>(_getContainerStyle());

  useEffect(() => {
    if (!pathname) return;
    const lastPath = pathname.split("/").at(-1);
    if (lastPath?.includes("/lista")) setActiveRoute(pathname.split(lastPath).join(""));
    else setActiveRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    setContainerStyle(_getContainerStyle);
  }, [isDrawerExpanded, isMobile]);

  useEffect(() => {
    if (lgAndDown) setIsDrawerExpanded(false);
  }, [lgAndDown]);

  useEffect(() => {
    if (isDrawerOpen) setIsDrawerExpanded(true);
  }, [isDrawerOpen]);

  return (
    <StoreContext.Provider
      value={{
        activeRoute,
        isDrawerExpanded,
        setIsDrawerExpanded,
        isDrawerOpen,
        setIsDrawerOpen,
        containerStyle,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
