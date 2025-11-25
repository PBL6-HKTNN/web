import { createFileRoute, Outlet, useLocation, Link } from '@tanstack/react-router'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/auth/_mainLayout')({
  component: AuthModalLayout,
})

function AuthModalLayout() {
  const location = useLocation()
  const isLogin = location.pathname === '/auth/login'
  const isRegister = location.pathname === '/auth/register'

  return (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to CodeMy
            </DialogTitle>
          </DialogHeader>

          <Tabs value={isRegister ? "register" : "login"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" asChild>
                <Link to="/auth/login">Login</Link>
              </TabsTrigger>
              <TabsTrigger value="register" asChild>
                <Link to="/auth/register">Register</Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              {isLogin && <Outlet />}
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              {isRegister && <Outlet />}
            </TabsContent>
          </Tabs>
        </DialogContent>
  )
}
