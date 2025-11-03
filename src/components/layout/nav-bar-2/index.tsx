import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowLeft, LogOut, User } from 'lucide-react'
import { useAuthState, useLogout } from '@/hooks/queries/auth-hooks'
import { ThemeChanger } from '@/components/shared/theme-changer'

export function LearningNavBar() {
  const { isAuthenticated, user } = useAuthState()
  const logoutMutation = useLogout()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      router.navigate({ to: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserInitials = (email?: string) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Back button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.navigate({ to: '/course' })}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Button>
          </div>

          {/* Right side - Auth and theme */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 h-auto">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getUserInitials(user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm text-foreground">
                      {user?.email || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/users/$userId" params={{ userId: user?.id || '' }} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center text-destructive focus:text-destructive"
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            <ThemeChanger />
          </div>
        </div>
      </div>
    </nav>
  )
}