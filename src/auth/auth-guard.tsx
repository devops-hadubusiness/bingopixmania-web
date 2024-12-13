// components
import PageLoader from '@/components/loaders/page-loader'

// auth
import { useAuth } from '@/auth/auth-provider'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth()
  return loading ? <PageLoader /> : <>{children}</>
}