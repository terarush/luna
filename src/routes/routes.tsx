import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { ThemeProvider } from "@/components/theme-provider"
import HomePage from "@/modules/home/index"
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

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

function GetStartedPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("getStarted.title")}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t("getStarted.description")}
        </p>
      </div>
    </div>
  )
}

const getStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/get-started",
  component: GetStartedPage,
})

export const routeTree = rootRoute.addChildren([homeRoute, getStartedRoute])