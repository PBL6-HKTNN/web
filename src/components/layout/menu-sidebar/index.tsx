

import { Link, useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ThemeChanger } from '@/components/shared/theme-changer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/queries/auth-hooks'

type MenuSidebarProps = {
  title: string,
  items: {
    label: string
    icon: React.ReactNode
    href: string
  }[]
}

export default function MenuSidebar({ title, items }: MenuSidebarProps) {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate({ to: '/' });
  };
  return (
      <Sidebar>
        <SidebarHeader className="flex !flex-row items-center mb-4">
          <ArrowLeft onClick={() => navigate({
            to: '..'
          })} className="h-6 w-6 cursor-pointer mr-4" />
          <span className="font-semibold dark:text-white text-2xl">{title}</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {items.length > 0 ? items.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <Link to={item.href} className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )) : 
            <>
            <p className="text-sm text-gray-500 dark:text-gray-400">No menu items available</p>
            </>
          }
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex gap-2 p-4 space-2">
            <ThemeChanger />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}