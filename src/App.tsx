// packages
import { createElement, ReactNode, useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'

// auth
import { AuthGuard } from '@/auth/auth-guard'
import { AuthProvider } from '@/auth/auth-provider'

// components
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import Topbar from '@/components/layout/topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

// pages
import NotFound from '@/pages/NotFound'

// utils
import { routes, checkRoutePermission } from '@/utils/routes-util'

// contexts
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { StoreContext, StoreProvider } from '@/contexts/StoreContext'
import { WebSocketProvider } from '@/contexts/WebSocketContext'

// store
import { useAuthStore } from '@/store/auth'

// types
type ProtectedRouteProps = {
  isAllowed: boolean
  redirectTo: string
}

function Main({ children }: { children: Readonly<ReactNode> }) {
  const { theme } = useTheme()
  const { containerStyle } = useContext(StoreContext)
  const showHeader = !['/401', '/404', '/login', '/'].includes(location.pathname)
  const showSidebar = !['/401', '/404', '/login', '/'].includes(location.pathname)

  function _openWhatsApp() {
    const phoneNumber = '+554195690272'
    const message = 'Olá! Eu gostaria de suporte do Bingo PIX Mania.'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {showSidebar && <AppSidebar />}

      <div className={`dark:bg-gray-850 bg-gray-100 ${showHeader ? 'xsAndDown:overflow-x-hidden smAndDown:px-12 lgAndUp:pl-[268px] mdAndUp:pr-14 py-12' : 'gradient-container'}`} style={containerStyle}>
        {showHeader && <Topbar />}

        <div className={theme === 'dark' ? 'dark-bottom-gradient' : 'bottom-gradient'} style={{ zIndex: showSidebar && showHeader ? -1 : 1, height: showSidebar && showHeader ? 400 : 200 }}></div>

        {children}
      </div>

      <Avatar className="size-16 p-1 fixed bottom-8 right-4 hover:cursor-pointer" onClick={_openWhatsApp}>
        <AvatarImage src="/images/misc/wpp.svg" />
      </Avatar>
    </>
  )
}

function ProtectedRoute({ isAllowed, redirectTo }: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      {routes.map(route => {
        if (!route.roles?.length) {
          return <Route key={route.name} path={route.path} element={route.component ? <Main>{createElement(route.component)}</Main> : <NotFound />} />
        } else {
          return (
            <Route key={route.name} element={<ProtectedRoute isAllowed={checkRoutePermission(user, route.roles)} redirectTo="/401" />}>
              <Route key={route.name} path={route.path} element={route.component ? <Main>{createElement(route.component)}</Main> : <NotFound />} />
            </Route>
          )
        }
      })}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark">
        <StoreProvider>
          <TooltipProvider delayDuration={0}>
            <AuthProvider>
              <AuthGuard>
                <SidebarProvider>
                  <WebSocketProvider>
                    <Toaster />
                    <App />
                  </WebSocketProvider>
                </SidebarProvider>
              </AuthGuard>
            </AuthProvider>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </Router>
  )
}
