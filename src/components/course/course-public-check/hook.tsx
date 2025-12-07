import { useState } from 'react'
import type { UUID } from '@/types'
import { useGetRequestTypes, useCreateRequest } from '@/hooks/queries/request-hooks'
import { RequestTypeEnum } from '@/types/db/request'
import { usePreSubmitCheck } from '@/hooks'
import type { PreSubmitCheckRes } from '@/types/db/course'

export const useCoursePublicCheck = (courseId: UUID) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkResults, setCheckResults] = useState<PreSubmitCheckRes | null>(null)

  const { data: requestTypesRes } = useGetRequestTypes()
  const preSubmitCheck = usePreSubmitCheck()
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
      // Perform the pre-submit check via the API
      const results = await preSubmitCheck.mutateAsync({
        courseId,
      })

      // results: ApiResponse<string>
      setCheckResults(results)
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

      const description = `Request to publish course "${courseId}" to public. ${
        checkResults?.isSuccess
          ? 'Course passed verification: ' + (checkResults?.data ?? '')
          : 'Course was requested to be reviewed for publication.'
      }`

      await createRequest.mutateAsync({
        requestTypeId: publicCourseType.id,
        description,
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
