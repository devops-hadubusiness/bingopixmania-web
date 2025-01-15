// packages
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

// store
import { useStore } from "@/store/store";

// dtos
import { UserProps, user_role } from "@/entities/user/user";

// interfaces
interface AuthContextProps {
  user: UserProps | null;
  loading: boolean;
  login: (user: UserProps, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, updateUser } = useStore();
  const [cookies, setCookie] = useCookies(["user", "token"]);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!(cookies.user && cookies.token));
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    const authenticated = !!(cookies.user && cookies.token);
    if (isAuthenticated != authenticated) setIsAuthenticated(authenticated);
  };

  useEffect(() => {
    if (!isAuthenticated && !["/400", "/401", "/403", "/404", "/500", "/login", "/nao-autorizado"].includes(location.pathname)) {
      // logout(); // TODO: descomentar
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

  const login = async (user: UserProps, token: string) => {
    setIsLoading(true);
    setCookie("user", user, { path: "/", maxAge: 86400 });
    setCookie("token", token, { path: "/", maxAge: 86400, sameSite: "lax" });
    updateUser(user);
    setIsLoading(false);
    navigate("/home");
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
