import ToolLayout from '@/components/layout/tool-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  FlagIcon,
  CheckCircleIcon
} from 'lucide-react'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/mod')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const items = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon />, href: '/mod' },
    { label: 'Courses', icon: <BookOpenIcon />, href: '/mod/courses' },
    // { label: 'Users', icon: <UsersIcon />, href: '/mod/users' },
    { label: 'Lecturer Management', icon: <CheckCircleIcon />, href: '/mod/lecturer-management' },
    { label: 'Student Reports', icon: <FlagIcon />, href: '/mod/reports-management' },
   
  ]
  return <ToolLayout items={items}><Outlet /></ToolLayout>
}
