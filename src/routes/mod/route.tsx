import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  FlagIcon,
  CheckCircleIcon
} from 'lucide-react'
import { roleGuard } from '@/utils'
import { UserRole } from '@/types/db'

export const Route = createFileRoute('/mod')({
  component: RouteComponent,
  beforeLoad: () => roleGuard([UserRole.MODERATOR, UserRole.ADMIN]),
})

function RouteComponent() {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon />, href: '/mod' },
    { label: 'Courses', icon: <BookOpenIcon />, href: '/mod/courses' },
    // { label: 'Users', icon: <UsersIcon />, href: '/mod/users' },
    { label: 'Lecturer Management', icon: <CheckCircleIcon />, href: '/mod/lecturer-management' },
    { label: 'Student Reports', icon: <FlagIcon />, href: '/mod/reports-management' },
   
  ]
  return <ToolLayout
    title='Moderator Panel'
  items={items}><Outlet /></ToolLayout>
}
