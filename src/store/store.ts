// packages
import { create } from "zustand";
import { Cookies } from "react-cookie";

// entities
import { UserProps } from "@/entities/user/user";

const cookies = new Cookies();

interface StoreState {
  user: UserProps | null;
  token?: string;
  logout: () => void;
  updateUser: (user: UserProps) => void;
}

export const useStore = create<StoreState>((set) => {
  const userCookie = cookies.get("user");
  const tokenCookie = cookies.get("token");

  return {
    user: userCookie || null,
    token: tokenCookie || undefined,
    logout: () => {
      cookies.remove("user", { path: "/" });
      cookies.remove("token", { path: "/" });
      location.href = "/login";
    },
    updateUser: (user) => {
      set({ user });
      cookies.set("user", user, { path: "/", maxAge: 86400 });
    },
  };
});
