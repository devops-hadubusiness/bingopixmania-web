// packages
import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";

// lib
import { AuthTokenError } from "./errors/AuthTokenError";

function setupAPIClient() {
  const cookies = new Cookies();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false, // TODO: somente em dev
  });

  api.interceptors.request.use(
    (config) => {
      const token = cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      if ([403, 401].includes(response.data?.statusCode)) {
        cookies.remove("company", { path: "/" });
        cookies.remove("user", { path: "/" });
        cookies.remove("token", { path: "/" });
        location.href = "/login";
      }

      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // qualquer erro 401 (não autorizado) desloga o usuário
        if (typeof window !== undefined) {
          // chama a função para deslogar o usuário
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = setupAPIClient();
