import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { BookOpen, BarChart3, Plus, Users } from 'lucide-react'

export const Route = createFileRoute('/lecturing-tool/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Lecturing Tool Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your courses, track analytics, and create engaging learning experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Plus className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>Create Course</CardTitle>
            <CardDescription>
              Start building a new course for your students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/lecturing-tool/course/create">
              <Button className="w-full">Create New Course</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>Manage Courses</CardTitle>
            <CardDescription>
              Edit, organize, and monitor your existing courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/lecturing-tool/course">
              <Button variant="outline" className="w-full">View Courses</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Analyze student performance and course engagement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/lecturing-tool/analytics">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Manage student enrollments and interactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Course "Introduction to React" was updated 2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">New student enrolled in "Advanced JavaScript" 5 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Quiz results for "Web Development Basics" are ready 1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
