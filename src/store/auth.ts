// packages
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// types
import { UserProps } from '@/entities/user/user'

// interfaces
interface AuthState {
  user: UserProps | null
  token: string | null
  isAuthenticated: boolean
  login: (user: UserProps, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true
        })
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })

        window.location.href = '/login'
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
