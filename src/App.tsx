// packages
import { createElement, ReactNode, useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

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
import { routes } from '@/utils/routes-util'

// contexts
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { StoreContext, StoreProvider } from '@/contexts/StoreContext'

function Main({ children }: { children: Readonly<ReactNode> }) {
  const { theme } = useTheme()
  const { containerStyle } = useContext(StoreContext)
  const showHeader = !['/404', '/login', '/'].includes(location.pathname)
  const showSidebar = !['/404', '/login', '/'].includes(location.pathname)

  function _openWhatsApp() {
    const phoneNumber = '+554195690272'
    const message = 'Olá! Eu gostaria de suporte do Bingo PIX Mania.'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {showSidebar && <AppSidebar />}

      <div className={`dark:bg-gray-850 bg-gray-100 ${showHeader ? 'smAndDown:pl-12 mdAndUp:pl-[268px] pr-14 py-12' : 'gradient-container'}`} style={containerStyle}>
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

function App() {
  return (
    <Routes>
      {routes.map(route => {
        return <Route key={route.name} path={route.path} element={route.component ? <Main>{createElement(route.component)}</Main> : <NotFound />} />
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
                  <Toaster />
                  <App />
                </SidebarProvider>
              </AuthGuard>
            </AuthProvider>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </Router>
  )
}
