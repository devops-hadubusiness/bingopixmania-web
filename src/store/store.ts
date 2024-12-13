// packages
import { create } from "zustand";
import { Cookies } from "react-cookie";

// entities
import { CompanyStore } from "@/entities/company/company";
import { UserProps } from "@/entities/user/user";

const cookies = new Cookies();

interface StoreState {
  company: CompanyStore | null;
  user: UserProps | null;
  token?: string;
  updateCompany: (company: CompanyStore) => void;
  logout: () => void;
  changeCompany: (company: CompanyStore) => void;
  updateUser: (user: UserProps) => void;
}

export const useStore = create<StoreState>((set) => {
  const companyCookie = cookies.get("company");
  const userCookie = cookies.get("user");
  const tokenCookie = cookies.get("token");

  return {
    company: companyCookie || null,
    user: userCookie || null,
    token: tokenCookie || undefined,
    updateCompany: (company) => {
      set({ company });
      cookies.set("company", company, { path: "/", maxAge: 86400 });
    },
    logout: () => {
      set({ company: null, user: null, token: undefined });
      cookies.remove("company", { path: "/" });
      cookies.remove("user", { path: "/" });
      cookies.remove("token", { path: "/" });
      location.href = "/login";
    },
    changeCompany: (company) => {
      if (company) {
        set({ company });
        cookies.set("company", company, { path: "/", maxAge: 86400 });
      }
    },
    updateUser: (user) => {
      set({ user });
      cookies.set("user", user, { path: "/", maxAge: 86400 });
    },
  };
});
