import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BookAIcon, LayoutDashboardIcon, BarChartIcon } from 'lucide-react'
import { RoleGuard } from '@/utils'
import { UserRole } from '@/types/db'

export const Route = createFileRoute('/lecturing-tool')({
  component: RouteComponent,
  beforeLoad: () => RoleGuard([UserRole.INSTRUCTOR]),
})

function RouteComponent() {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon />, href: '/lecturing-tool' },
    { label: 'Course', icon: <BookAIcon />, href: '/lecturing-tool/course' },
    { label: 'Analytics', icon: <BarChartIcon />, href: '/lecturing-tool/analytics' },
  ]
  return <ToolLayout title="Lecturing Tool" items={items}><Outlet /></ToolLayout>
}
