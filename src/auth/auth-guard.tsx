// packages
import { useState, useEffect } from 'react'

// components
import PageLoader from '@/components/loaders/page-loader'

// auth
import { useAuth } from '@/auth/auth-provider'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading) return <PageLoader />
  if (!showContent) return <PageLoader />

  return <>{children}</>
}
