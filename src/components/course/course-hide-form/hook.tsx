import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UUID } from '@/types'
import { courseHideSchema, type CourseHideFormData } from './validator'

export const useCourseHideForm = (courseId: UUID) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Mock API call - simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Course hide submitted:', {
        courseId,
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      })

      // Show success message or handle response
      closeModal()
    } catch (error) {
      console.error('Failed to hide course:', error)
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
