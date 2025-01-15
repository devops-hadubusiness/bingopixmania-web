// packages
import { useContext, createElement, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// utils
import { routes } from "@/utils/routes-util";

// pages
import Login from "@/pages/Login";

// auth
import { AuthGuard } from "@/auth/auth-guard";
import { AuthProvider } from "@/auth/auth-provider";

// components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Topbar from "@/components/layout/topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// pages
import NotFound from "@/pages/NotFound";

// contexts
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StoreContext, StoreProvider } from "@/contexts/StoreContext";

function Main({ children }: { children: Readonly<ReactNode> }) {
  const { containerStyle } = useContext(StoreContext);

  function _openWhatsApp() {
    const phoneNumber = "+554195690272";
    const message = "Olá! Eu gostaria de suporte do Bingo PIX Mania.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <>
      <AppSidebar />

      <div className="smAndDown:pl-12 mdAndUp:pl-[268px] pr-14 py-12 dark:bg-gray-850 bg-gray-100" style={containerStyle}>
        <Topbar />
        {children}
      </div>

      <Avatar className="size-16 p-1 fixed bottom-8 right-4 hover:cursor-pointer" onClick={_openWhatsApp}>
        <AvatarImage src="/images/misc/wpp.svg" />
      </Avatar>
    </>
  );
}

function App() {
  return (
    <Routes>
      {routes.map((route) => {
        return <Route key={route.name} path={route.path} element={route.component ? <Main>{createElement(route.component)}</Main> : <NotFound />} />;
      })}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <ThemeProvider>
        <StoreProvider>
          <TooltipProvider>
            <AuthProvider>
              <AuthGuard>
                <SidebarProvider>
                  <Toaster />
                  <App />
                </SidebarProvider>
              </AuthGuard>
            </AuthProvider>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </Router>
  );
}
