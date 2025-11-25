

import { Link } from '@tanstack/react-router'
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

type MenuSidebarProps = {
  items: {
    label: string
    icon: React.ReactNode
    href: string
  }[]
}

export default function MenuSidebar({ items }: MenuSidebarProps) {
  return (
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold dark:text-white text-2xl">Menu</span>
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
          <div className="p-4">
            <ThemeChanger />
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}