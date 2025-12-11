import { useInstructorCourseAnalytics } from '@/hooks/queries/course/course-hooks'
import { useGetAnalytics } from '@/hooks/queries/payment-hooks'
import { getAuthState } from '@/hooks/queries/auth-hooks'
import { useMemo } from 'react'

export const useAnalytics = () => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useInstructorCourseAnalytics()
  
  // Get current user for analytics request
  const currentUser = useMemo(() => getAuthState().user, [])
  
  // Prepare analytics request parameters
  const analyticsRequest = useMemo(() => {
    if (!currentUser?.id) return null
    return {
      instructorId: currentUser.id,
      // Default to current year for analytics
    //   startDate: `${new Date().getFullYear()}-01-01`,
    //   endDate: `${new Date().getFullYear()}-12-31`,
    }
  }, [currentUser?.id])
  
  const { data: revenueData, isLoading: revenueLoading, error: revenueError } = useGetAnalytics(
    analyticsRequest || {
      instructorId: '',
      startDate: '',
      endDate: '',
    },
    { enabled: !!analyticsRequest }
  )

  const analytics = useMemo(() => {
    if (!analyticsData?.data) return null
    return analyticsData.data
  }, [analyticsData])

  const revenue = useMemo(() => {
    if (!revenueData?.data) return null
    return revenueData.data
  }, [revenueData])

  return {
    analytics,
    revenue,
    isLoading: analyticsLoading || revenueLoading,
    error: analyticsError || revenueError,
  }
}
