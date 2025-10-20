import { Dialog, DialogContent } from '@/components/ui/dialog'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { guestGuard } from '@/utils'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
  beforeLoad: ({ location }) => {
    // Check if user is already authenticated and redirect away from auth pages
    guestGuard()

    // Redirect /auth to /auth/login
    if (location.pathname === '/auth' || location.pathname === '/auth/') {
      throw redirect({
        to: '/auth/login',
        replace: true
      })
    }
  }
})

function AuthLayout() {
  return <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <Outlet />
        </DialogContent>
      </Dialog>
    </div>
  </>
}
