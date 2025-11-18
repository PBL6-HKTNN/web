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
import { Book, Code, LogOut, User } from 'lucide-react'
import { useAuthState, useLogout } from '@/hooks/queries/auth-hooks'
import { ThemeChanger } from '@/components/shared/theme-changer'

export function NavBar() {
  const { isAuthenticated, user } = useAuthState()
  const logoutMutation = useLogout()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      // Redirect to home page after logout
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
    <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">CodeMy</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
          <Link to="/course" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Courses
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/lecturing-tool/course" data-testid="lecturing-tool-link" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Tool
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-sm">
                          {getUserInitials(user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
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
                    
                    <DropdownMenuItem asChild>
                      <Link to="/your-courses" className="flex items-center">
                        <Book className="mr-2 h-4 w-4" />
                        Your Courses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                    
                    
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-300" asChild>
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}

            <ThemeChanger />
          </div>
        </div>
      </div>
    </nav>
  )
}
