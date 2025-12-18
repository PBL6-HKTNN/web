import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, FileText, DollarSign, Shield, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage users, courses, requests, and system settings</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Users Management Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/users' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">User Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage users, roles, and permissions
            </p>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View Users
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Courses Management Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/courses' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">Course Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage all courses
            </p>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 dark:text-green-400">
              View Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Requests & Reports Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/requests-reports' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">Requests & Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage user requests and reports
            </p>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 dark:text-orange-400">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/transactions' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">Transactions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View revenue and payment transactions
            </p>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              View Transactions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/permissions' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1">Permissions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage system permissions and access control
            </p>
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View Permissions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
