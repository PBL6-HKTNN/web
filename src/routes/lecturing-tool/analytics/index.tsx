import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export const Route = createFileRoute('/lecturing-tool/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [timeFilter, setTimeFilter] = useState('last30days')
  const [sortBy, setSortBy] = useState('enrollment')

  // Mock data
  const mockCourses = [
    { id: 1, name: 'Introduction to React', enrollments: 150, revenue: 7500 },
    { id: 2, name: 'Advanced JavaScript', enrollments: 200, revenue: 10000 },
    { id: 3, name: 'Python for Beginners', enrollments: 120, revenue: 6000 },
    { id: 4, name: 'Data Structures', enrollments: 80, revenue: 4000 },
    { id: 5, name: 'Machine Learning Basics', enrollments: 300, revenue: 15000 },
  ]

  const sortedCourses = [...mockCourses].sort((a, b) => {
    if (sortBy === 'enrollment') {
      return b.enrollments - a.enrollments
    } else {
      return b.revenue - a.revenue
    }
  })

  const chartConfig = {
    enrollments: {
      label: "Enrollments",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <div className="w-full min-h-screen p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="lastyear">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrollment">Number of Enrollments</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full max-h-80">
              <BarChart accessibilityLayer data={sortedCourses}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => sortBy === 'revenue' ? `$${value}` : value}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey={sortBy === 'enrollment' ? 'enrollments' : 'revenue'}
                  fill={`var(--color-${sortBy === 'enrollment' ? 'enrollments' : 'revenue'})`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.enrollments}</TableCell>
                  <TableCell>{course.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
