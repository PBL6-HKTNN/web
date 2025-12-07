import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { User, CreditCard, Settings, Send } from 'lucide-react'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const items = [
    {
      label: 'General',
      icon: <Settings className="h-4 w-4" />,
      href: '/settings'
    },
    {
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      href: '/settings/profile'
    },
    {
      label: 'Payment',
      icon: <CreditCard className="h-4 w-4" />,
      href: '/settings/payment'
    },
    {
      label: 'Request History',
      icon: <Send className="h-4 w-4" />,
      href: '/settings/request-history'
    }
  ]
  return <>
    <ToolLayout title="Settings" items={items}>
      <Outlet />
    </ToolLayout>
  </>
}
