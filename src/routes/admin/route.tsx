import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  LayoutDashboardIcon,
  UsersIcon,
  CreditCardIcon,
  BookOpenIcon,
  ShieldIcon,
  FileIcon
} from 'lucide-react'
import { roleGuard } from '@/utils'
import { UserRole } from '@/types/db'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: () => roleGuard([UserRole.ADMIN]),
})

function RouteComponent() {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon />, href: '/admin' },
    { label: 'Users', icon: <UsersIcon />, href: '/admin/users' },
    { label: 'Transactions', icon: <CreditCardIcon />, href: '/admin/transactions' },
    { label: 'Courses', icon: <BookOpenIcon />, href: '/admin/courses' },
    { label: 'Permissions', icon: <ShieldIcon />, href: '/admin/permissions' },
    { label: 'Requests & Reports', icon: <FileIcon />, href: '/admin/requests-reports' },
  ]
  return <ToolLayout title='Admin Panel' items={items}><Outlet /></ToolLayout>
}
