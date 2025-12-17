import { createFileRoute } from '@tanstack/react-router'
import { useGetCourses } from '@/hooks/queries/course/course-hooks'
import { useMemo } from 'react'
import { CourseListing } from '@/components/admin/courses/course-listing'
import type { GetCoursesFilterReq } from '@/types/db/course'

export const Route = createFileRoute('/admin/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const filterParams: GetCoursesFilterReq = useMemo(() => {
    const params: GetCoursesFilterReq = {
      Page: 1,
      PageSize: 100, // Get more courses for admin view
    }
    return params
  }, [])

  const {
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCourses(filterParams)

  const courses = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || []
  }, [data])

  return (
    <CourseListing
      courses={courses}
      isLoading={isLoading}
      error={error}
      isFetching={isFetching}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    />
  )
}