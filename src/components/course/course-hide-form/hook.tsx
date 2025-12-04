import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UUID } from '@/types'
import { courseHideSchema, type CourseHideFormData } from './validator'
import { useGetRequestTypes, useCreateRequest } from '@/hooks/queries/request-hooks'
import { RequestTypeEnum } from '@/types/db/request'

export const useCourseHideForm = (courseId: UUID) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: requestTypesRes } = useGetRequestTypes()
  const createRequest = useCreateRequest()

  const form = useForm<CourseHideFormData>({
    resolver: zodResolver(courseHideSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      reason: '',
    },
  })

  const openModal = () => {
    setIsOpen(true)
    form.reset()
  }

  const closeModal = () => {
    setIsOpen(false)
    setIsSubmitting(false)
    form.reset()
  }

  const onSubmit = async (data: CourseHideFormData) => {
    setIsSubmitting(true)

    try {
      // Find the HIDE_A_COURSE request type
      const hideCourseType = requestTypesRes?.data?.find(
        (type) => type.type === RequestTypeEnum.HIDE_A_COURSE
      )

      if (!hideCourseType) {
        throw new Error('Hide course request type not found')
      }

      const description = `Request to hide course from public view.
        Start Date: ${data.startDate.toLocaleDateString()}
        End Date: ${data.endDate.toLocaleDateString()}
        Reason: ${data.reason}`

      await createRequest.mutateAsync({
        requestTypeId: hideCourseType.id,
        description,
        courseId,
      })

      closeModal()
    } catch (error) {
      console.error('Failed to submit hide course request:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    isSubmitting,
    form,
    openModal,
    closeModal,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
