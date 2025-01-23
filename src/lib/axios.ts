// packages
import axios, { AxiosError } from 'axios'

// lib
import { AuthTokenError } from './errors/AuthTokenError'

// store
import { useAuthStore } from '@/store/auth'

function setupAPIClient() {
  const { token, logout } = useAuthStore.getState()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false // TODO: somente em dev
  })

  api.interceptors.request.use(
    config => {
      const storageToken = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
      if (token || storageToken) config.headers.Authorization = `Bearer ${token || storageToken}`
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    response => {
      if ([403, 401].includes(response.data?.statusCode)) logout()
      return response
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // qualquer erro 401 (não autorizado) desloga o usuário
        if (typeof window !== undefined) {
          // chama a função para deslogar o usuário
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}

export const api = setupAPIClient()
