// packages
import { createContext, useContext, useEffect, useState } from 'react'

// store
import { useAuthStore } from '@/store/auth'

// variables
const AuthContext = createContext<{ loading: boolean }>({ loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token, logout, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authenticated = !!(user || token || isAuthenticated)

    if (!authenticated && !['/400', '/401', '/403', '/404', '/500', '/login', '/nao-autorizado'].includes(location.pathname)) {
      logout()
      return
    } else if (authenticated && ['/400', '/401', '/403', '/404', '/500', '/login', '/nao-autorizado'].includes(location.pathname)) return
    else if (authenticated) return
  }, [user, token, isAuthenticated])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return <AuthContext.Provider value={{ loading: isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
