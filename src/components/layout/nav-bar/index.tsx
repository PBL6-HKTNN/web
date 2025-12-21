import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Book,
  Code,
  LogOut,
  User,
  ShoppingCart,
  PenToolIcon,
  Cog,
  ShieldUserIcon,
  KeyIcon,
} from "lucide-react";
import { useAuthState, useLogout } from "@/hooks/queries/auth-hooks";
import { useGetCart } from "@/hooks/queries/payment-hooks";
import { ThemeChanger } from "@/components/shared/theme-changer";
import RequiredRole from "@/components/user/required-role";
import { UserRole } from "@/types/db";
import { BeAnInstructorLine } from "@/components/shared/be-an-instructor-line";

export function NavBar() {
  const { isAuthenticated, user } = useAuthState();
  const logoutMutation = useLogout();
  const router = useRouter();
  const { data: cartData } = useGetCart();
  const cartItemCount = cartData?.data?.length || 0;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Redirect to home page after logout
      router.navigate({ to: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {user?.role !== UserRole.INSTRUCTOR && <BeAnInstructorLine />}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Code className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  CodeMy
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/course"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/roadmap"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Roadmap
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                About
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Cart Icon */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    asChild
                  >
                    <Link to="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {cartItemCount > 99 ? "99+" : cartItemCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 px-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.profilePicture || ""}
                            alt={user?.email || "User Avatar"}
                          />
                          <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-sm">
                            {getUserInitials(user?.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user?.email || "User"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/users/$userId"
                          params={{ userId: user?.id || "" }}
                          className="flex items-center"
                        >
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
                      <RequiredRole roles={[UserRole.INSTRUCTOR]}>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/lecturing-tool"
                            className="flex items-center"
                          >
                            <PenToolIcon className="mr-2 h-4 w-4" />
                            Lecturing Tool
                          </Link>
                        </DropdownMenuItem>
                      </RequiredRole>
                      <RequiredRole roles={[UserRole.MODERATOR]}>
                        <DropdownMenuItem asChild>
                          <Link to="/mod" className="flex items-center">
                            <ShieldUserIcon className="mr-2 h-4 w-4" />
                            Moderator Tools
                          </Link>
                        </DropdownMenuItem>
                      </RequiredRole>
                      <RequiredRole roles={[UserRole.ADMIN]}>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <KeyIcon className="mr-2 h-4 w-4" />
                            Admin Tools
                          </Link>
                        </DropdownMenuItem>
                      </RequiredRole>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Cog className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:border-slate-700 dark:text-slate-300"
                    asChild
                  >
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}

              <ThemeChanger />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
