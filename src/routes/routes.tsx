import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import { ThemeProvider } from "@/components/theme-provider"
import ChatPage from "@/modules/chat/index"
import NotFound from "@/modules/error/not-found"

import "../styles.css"

import { Toaster } from "@/components/ui/sonner"

export const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Outlet />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
})

export const routeTree = rootRoute.addChildren([chatRoute])