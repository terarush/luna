import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from '@/routes/routes'
import NotFound from '@/modules/error/not-found'
import { queryClient } from '@/lib/query-client'

export const router = createTanStackRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
