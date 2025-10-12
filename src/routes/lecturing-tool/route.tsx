import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BookAIcon, LayoutDashboardIcon } from 'lucide-react'

export const Route = createFileRoute('/lecturing-tool')({
  component: RouteComponent,
})

function RouteComponent() {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon />, href: '/lecturing-tool' },
    { label: 'Course', icon: <BookAIcon />, href: '/lecturing-tool/course' },
  ]
  return <ToolLayout items={items}><Outlet /></ToolLayout>
}
