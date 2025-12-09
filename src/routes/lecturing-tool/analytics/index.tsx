import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useAnalytics } from './-hook'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { Course } from '@/types/db/course'

export const Route = createFileRoute('/lecturing-tool/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { analytics, revenue, isLoading, error } = useAnalytics()
  
  // Chart filters
  const [yearFilter, setYearFilter] = useState<number>(2025)

  // Mock course data with monthly series for two years (2024/2025)
  type MockCourse = {
    id: string
    name: string
    monthly: Record<number, number[]>
    price: number
  }

    const mockCourses: MockCourse[] = useMemo(() => [
    {
      id: 'c1',
      name: 'Introduction to React',
      monthly: {
        2024: [10, 12, 14, 18, 16, 20, 22, 24, 18, 16, 12, 10],
        2025: [12, 14, 15, 20, 18, 22, 24, 22, 20, 18, 14, 12],
      },
      price: 50,
    },
    {
      id: 'c2',
      name: 'Advanced JavaScript',
      monthly: {
        2024: [20, 18, 22, 26, 30, 28, 34, 40, 32, 30, 24, 20],
        2025: [28, 26, 30, 36, 34, 40, 44, 48, 40, 36, 30, 28],
      },
      price: 80,
    },
    {
      id: 'c3',
      name: 'Python for Beginners',
      monthly: {
        2024: [8, 10, 9, 12, 14, 16, 20, 18, 12, 10, 9, 8],
        2025: [10, 12, 11, 14, 16, 18, 22, 20, 16, 12, 11, 10],
      },
      price: 40,
    },
    {
      id: 'c4',
      name: 'Data Structures',
      monthly: {
        2024: [6, 8, 9, 10, 12, 12, 14, 16, 12, 10, 8, 6],
        2025: [7, 9, 11, 12, 14, 13, 16, 18, 14, 12, 9, 8],
      },
      price: 35,
    },
    {
      id: 'c5',
      name: 'Machine Learning Basics',
      monthly: {
        2024: [25, 30, 28, 32, 36, 40, 44, 48, 42, 36, 30, 25],
        2025: [30, 34, 36, 40, 42, 46, 50, 54, 48, 44, 36, 34],
      },
      price: 120,
    },
  ], [])

  const years = useMemo(() => [2024, 2025], [])
  const months = useMemo(() => [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ], [])

  const yearData = useMemo(() => {
    return months.map((_, monthIdx) => {
      // Use real monthly enrollments from API if available
      const enrollments = analytics?.monthlyNewEnrollments?.[monthIdx] ?? (() => {
        // Fallback to mock data calculation
        let total = 0
        mockCourses.forEach((c) => {
          const m = c.monthly[yearFilter] || []
          const enroll = m?.[monthIdx] ?? 0
          total += enroll
        })
        return total
      })()

      // Use real monthly revenue from API if available
      const revenueAmount = revenue?.monthlyRevenue?.[monthIdx] ?? (() => {
        // Fallback to mock data calculation
        let total = 0
        mockCourses.forEach((c) => {
          const m = c.monthly[yearFilter] || []
          const enroll = m?.[monthIdx] ?? 0
          total += enroll * c.price
        })
        return total
      })()

      return { month: months[monthIdx], enrollments, revenue: revenueAmount }
    })
  }, [yearFilter, mockCourses, months, analytics, revenue])

  // Compute top 5 courses by year
  const topCoursesByEnroll = useMemo(() => {
    // Use real analytics top courses if available
    if (analytics?.top5Courses && analytics.top5Courses.length > 0) {
      return analytics.top5Courses.slice(0, 5).map((course) => ({
        id: course.id,
        name: course.title,
        enrollments: course.totalEnrollments, // Using numberOfReviews as proxy for enrollments
      }))
    }
    // Fallback to mock data
    const arr = mockCourses.map((c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      const sum = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return { id: c.id, name: c.name, enrollments: sum }
    })
    return arr.sort((a, b) => b.enrollments - a.enrollments).slice(0, 5)
  }, [analytics, yearFilter, mockCourses])

  const topCoursesByRevenue = useMemo(() => {
    // Use real analytics top courses by revenue if available
    if (revenue?.top5CourseRevenue && revenue.top5CourseRevenue.length > 0) {
      return revenue.top5CourseRevenue.slice(0, 5).map((course: Course) => ({
        id: course.id,
        name: course.title,
        revenue: course.price || 0, // Using price as revenue proxy since Course doesn't have direct revenue field
      }))
    }
    // Fallback to mock data
    const arr = mockCourses.map((c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      const sumEnroll = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return { id: c.id, name: c.name, revenue: sumEnroll * c.price }
    })
    return arr.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [yearFilter, mockCourses, revenue])

  const totalRevenue = useMemo(() => {
    // Use real total revenue from API if available
    if (revenue?.totalRevenue !== undefined) {
      return revenue.totalRevenue
    }
    // Fallback to mock data calculation
    return mockCourses.reduce((acc, c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      const enrollSum = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return acc + enrollSum * c.price
    }, 0)
  }, [yearFilter, mockCourses, revenue])

  // Use real analytics data if available, otherwise fall back to mock data
  const totalEnrollments = analytics?.totalEnrollments ?? mockCourses.reduce((acc, c) => {
    const monthsArr: number[] = c.monthly[yearFilter] || []
    const enrollSum = monthsArr.reduce((a: number, b: number) => a + b, 0)
    return acc + enrollSum
  }, 0)

  const totalCoursesCount = analytics?.totalCourses ?? mockCourses.length

  const courseMostEnroll = useMemo(() => {
    // Use real analytics top course if available
    if (analytics?.top5Courses && analytics.top5Courses.length > 0) {
      const topCourse = analytics.top5Courses[0]
      return {
        id: topCourse.id,
        name: topCourse.title,
        total: topCourse.numberOfReviews || 0, // Using numberOfReviews as proxy for students
      }
    }
    // Fallback to mock data
    const arr = mockCourses.map((c) => ({
      id: c.id,
      name: c.name,
      total: (c.monthly[yearFilter] || []).reduce((a: number, b: number) => a + b, 0),
    }))
    return arr.reduce((prev, cur) => (cur.total > prev.total ? cur : prev), arr[0])
  }, [analytics, yearFilter, mockCourses])

  const chartConfig = useMemo(
    () => ({
      enrollments: {
        label: 'Enrollments',
        theme: { light: 'hsl(215 60% 50%)', dark: 'hsl(215 60% 60%)' },
      },
      revenue: {
        label: 'Revenue',
        theme: { light: 'hsl(340 70% 45%)', dark: 'hsl(340 70% 55%)' },
      },
    } satisfies ChartConfig),
    []
  )

  function formatCurrencyShort(n: number) {
    if (!n) return '$0'
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
    return `$${n}`
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-6 space-y-6">
        <div className="text-left space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen p-6 space-y-6">
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Monitor your course performance and student engagement with detailed analytics.
        </p>
      </div>
      {/* General summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoursesCount}</div>
            <div className="text-sm text-muted-foreground">Available Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <div className="text-sm text-muted-foreground">Enrollments in {yearFilter}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue in {yearFilter}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseMostEnroll?.name}</div>
            <div className="text-sm text-muted-foreground">{courseMostEnroll?.total} students</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
              <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={String(yearFilter)} onValueChange={(v) => setYearFilter(parseInt(v))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{String(y)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Line Chart: enrollments and revenue over 12 months */}
              <Card className='md:col-span-2'>
                <CardHeader>
                  <CardTitle>Enrollments & Revenue (Monthly)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="min-h-[240px] max-h-96 w-full">
                    <LineChart data={yearData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      {/* Left axis: Enrollments */}
                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tick={{ fill: 'var(--color-enrollments)' }}
                      />
                      {/* Right axis: Revenue */}
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatCurrencyShort(Number(v))}
                        tick={{ fill: 'var(--color-revenue)' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => {
                        if (!name) return <span>{Number(value).toLocaleString()}</span>
                        if (name === 'revenue') {
                          return <span className="text-foreground font-mono font-medium tabular-nums">{formatCurrencyShort(Number(value))}</span>
                        }
                        return <span className="text-foreground font-mono font-medium tabular-nums">{Number(value).toLocaleString()}</span>
                      }} />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="enrollments"
                        stroke={`var(--color-enrollments)`}
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        strokeOpacity={0.95}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke={`var(--color-revenue)`}
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        strokeOpacity={0.95}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
          </div>

          {/* Charts Section - Top 5 bar charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Courses by Enrollments (Year {yearFilter})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ enrollments: chartConfig.enrollments }} className="min-h-[280px]">
                  <BarChart data={topCoursesByEnroll} layout="vertical">
                    <CartesianGrid vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Courses by Revenue (Year {yearFilter})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ revenue: chartConfig.revenue }} className="min-h-[280px]">
                  <BarChart data={topCoursesByRevenue} layout="vertical">
                    <CartesianGrid vertical={false} />
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                    <YAxis dataKey="name" type="category" width={140} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
