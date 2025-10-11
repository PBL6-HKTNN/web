import { GlobalProvider } from '@/contexts'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
    <GlobalProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </GlobalProvider>
    </>
  ),
})