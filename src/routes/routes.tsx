import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import { MuiThemeProvider } from "@/shared/themes/mui-theme-provider"
import ChatPage from "@/modules/chat/index"
import NotFound from "@/modules/error/not-found"

import "../styles.css"

import { Toaster } from "sonner"

export const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <MuiThemeProvider>
      <div className="font-sans antialiased">
        <Outlet />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-lg shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
              description: "text-zinc-500 dark:text-zinc-400",
            },
          }}
        />
      </div>
    </MuiThemeProvider>
  )
}

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
})

export const routeTree = rootRoute.addChildren([chatRoute])