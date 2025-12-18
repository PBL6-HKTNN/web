import { useState, useMemo } from 'react'
import { CourseStatus } from '@/types/db/course'
import type { Course } from '@/types/db/course'
import { Clock, CheckCircle } from 'lucide-react'

export const useCourseListing = (courses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.language?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [courses, searchTerm, statusFilter])

  const getStatusBadge = (status: CourseStatus) => {
    const statusLabels = {
      [CourseStatus.DRAFT]: 'Draft',
      [CourseStatus.PUBLISHED]: 'Published',
      [CourseStatus.ARCHIVED]: 'Archived',
    } as const

    const variants = {
      [CourseStatus.DRAFT]: 'outline',
      [CourseStatus.PUBLISHED]: 'default',
      [CourseStatus.ARCHIVED]: 'secondary',
    } as const

    const icons = {
      [CourseStatus.DRAFT]: <Clock className="w-3 h-3" />,
      [CourseStatus.PUBLISHED]: <CheckCircle className="w-3 h-3" />,
      [CourseStatus.ARCHIVED]: <Clock className="w-3 h-3" />,
    }

    return {
      variant: variants[status] || 'secondary',
      label: statusLabels[status] || 'Unknown',
      icon: icons[status],
    }
  }

  const stats = useMemo(() => {
    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === CourseStatus.PUBLISHED).length,
      draftCourses: courses.filter(c => c.status === CourseStatus.DRAFT).length,
    }
  }, [courses])

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredCourses,
    getStatusBadge,
    stats,
  }
}

