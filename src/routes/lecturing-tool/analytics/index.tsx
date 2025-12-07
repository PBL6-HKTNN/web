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

export const Route = createFileRoute('/lecturing-tool/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
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
      let enrollments = 0
      let revenue = 0
      mockCourses.forEach((c) => {
        const m = c.monthly[yearFilter] || []
        const enroll = m?.[monthIdx] ?? 0
        enrollments += enroll
        revenue += enroll * c.price
      })
      return { month: months[monthIdx], enrollments, revenue }
    })
  }, [yearFilter, mockCourses, months])

  // Compute top 5 courses by year
  const topCoursesByEnroll = useMemo(() => {
    const arr = mockCourses.map((c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      // Top 5 charts: aggregate by year only (ignore month filter)
      const sum = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return { id: c.id, name: c.name, enrollments: sum }
    })
    return arr.sort((a, b) => b.enrollments - a.enrollments).slice(0, 5)
  }, [yearFilter, mockCourses])

  const topCoursesByRevenue = useMemo(() => {
    const arr = mockCourses.map((c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      // Top 5 charts: aggregate by year only (ignore month filter)
      const sumEnroll = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return { id: c.id, name: c.name, revenue: sumEnroll * c.price }
    })
    return arr.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [yearFilter, mockCourses])

  const totalRevenue = useMemo(() => {
    return mockCourses.reduce((acc, c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      const enrollSum = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return acc + enrollSum * c.price
    }, 0)
  }, [yearFilter, mockCourses])

  const totalEnrollments = useMemo(() => {
    return mockCourses.reduce((acc, c) => {
      const monthsArr: number[] = c.monthly[yearFilter] || []
      const enrollSum = monthsArr.reduce((a: number, b: number) => a + b, 0)
      return acc + enrollSum
    }, 0)
  }, [yearFilter, mockCourses])

  const courseMostEnroll = useMemo(() => {
    const arr = mockCourses.map((c) => ({
      id: c.id,
      name: c.name,
      total: (c.monthly[yearFilter] || []).reduce((a: number, b: number) => a + b, 0),
    }))
    return arr.reduce((prev, cur) => (cur.total > prev.total ? cur : prev), arr[0])
  }, [yearFilter, mockCourses])

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
            <div className="text-2xl font-bold">{mockCourses.length}</div>
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
