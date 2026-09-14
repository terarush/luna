import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import { ThemeProvider } from "@/shared/theme-provider"
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
    <ThemeProvider>
      <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-950 antialiased selection:bg-sky-500/20 dark:bg-zinc-950 dark:text-zinc-50">
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
    </ThemeProvider>
  )
}

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ChatPage,
})

export const routeTree = rootRoute.addChildren([chatRoute])