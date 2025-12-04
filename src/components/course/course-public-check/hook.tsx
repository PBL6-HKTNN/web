import { useState } from 'react'
import type { UUID } from '@/types'
import { useGetRequestTypes, useCreateRequest } from '@/hooks/queries/request-hooks'
import { RequestTypeEnum } from '@/types/db/request'

export const useCoursePublicCheck = (courseId: UUID) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkResults, setCheckResults] = useState<{
    hasModules: boolean
    hasLessons: boolean
    hasValidPrice: boolean
    hasThumbnail: boolean
    isPublishable: boolean
  } | null>(null)

  const { data: requestTypesRes } = useGetRequestTypes()
  const createRequest = useCreateRequest()

  const openModal = () => {
    setIsOpen(true)
    setCheckResults(null)
  }

  const closeModal = () => {
    setIsOpen(false)
    setIsChecking(false)
    setIsSubmitting(false)
  }

  const performCheck = async () => {
    setIsChecking(true)

    // Simulate checking process with delays
    try {
      // Mock API call with simulated delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const results = {
        hasModules: Math.random() > 0.2, // 80% pass
        hasLessons: Math.random() > 0.15, // 85% pass
        hasValidPrice: Math.random() > 0.1, // 90% pass
        hasThumbnail: Math.random() > 0.05, // 95% pass
      }

      const isPublishable = Object.values(results).every(v => v === true)

      setCheckResults({
        ...results,
        isPublishable,
      })
    } finally {
      setIsChecking(false)
    }
  }

  const submitPublication = async () => {

    setIsSubmitting(true)

    try {
      // Find the PUBLIC_A_COURSE request type
      const publicCourseType = requestTypesRes?.data?.find(
        (type) => type.type === RequestTypeEnum.PUBLIC_A_COURSE
      )

      if (!publicCourseType) {
        throw new Error('Public course request type not found')
      }

      await createRequest.mutateAsync({
        requestTypeId: publicCourseType.id,
        description: `Request to publish course "${courseId}" to public. Course has passed all verification checks.`,
        courseId,
      })

      closeModal()
    } catch (error) {
      console.error('Failed to submit publication request:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    isChecking,
    isSubmitting,
    checkResults,
    openModal,
    closeModal,
    performCheck,
    submitPublication,
  }
}
