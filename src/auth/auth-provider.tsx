// packages
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

// store
import { useStore } from "@/store/store";

// dtos
import { UserProps, user_role } from "@/entities/user/user";
import { CompanyProps } from "@/entities/company/company";

// interfaces
interface AuthContextProps {
  user: UserProps | null;
  loading: boolean;
  login: (user: UserProps, token: string, company: { companyId: number, company: CompanyProps }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, updateCompany, updateUser } = useStore();
  const [cookies, setCookie] = useCookies(["user", "token", "company"]);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!(cookies.user && cookies.token && cookies.company));
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    const authenticated = !!(cookies.user && cookies.token && cookies.company);
    if (isAuthenticated != authenticated) setIsAuthenticated(authenticated);
  };

  useEffect(() => {
    if (!isAuthenticated && !["/400", "/401", "/403", "/404", "/500", "/login", "/nao-autorizado"].includes(location.pathname)) {
      logout();
      return;
    } else if (!isAuthenticated && ["/400", "/401", "/403", "/404", "/500", "/login", "/nao-autorizado"].includes(location.pathname)) return;
    else if (isAuthenticated) {
      if (user?.role === user_role.ADMIN) return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    initializeAuth();
  }, [cookies]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (user: UserProps, token: string, company: { companyId: number, company: CompanyProps }) => {
    setIsLoading(true);
    setCookie("user", user, { path: "/", maxAge: 86400 });
    setCookie("company", { ...company }, { path: "/", maxAge: 86400 });
    setCookie("token", token, { path: "/", maxAge: 86400, sameSite: "lax" });
    updateUser(user);
    updateCompany(company.company);
    setIsLoading(false);
    navigate("/sessoes");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
