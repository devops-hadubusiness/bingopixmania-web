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
import SideDrawer from "@/components/layout/side-drawer";

// pages
import NotFound from "@/pages/NotFound";

// contexts
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StoreContext, StoreProvider } from "@/contexts/StoreContext";

function Main({ children }: { children: Readonly<ReactNode> }) {
  const { containerStyle } = useContext(StoreContext);

  return (
    <>
      <Topbar />
      <SideDrawer />

      <div className="pl-12 pr-14 py-12 dark:bg-gray-850 bg-gray-100" style={containerStyle}>
        {children}
      </div>
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
                <Toaster />
                <App />
              </AuthGuard>
            </AuthProvider>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </Router>
  );
}
