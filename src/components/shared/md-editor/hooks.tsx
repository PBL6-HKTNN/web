import { useState, useCallback, useRef, useEffect } from 'react'
import { useUploadFile } from '@/hooks/queries/storage-hooks'
import type { FileType } from '@/types/core/storage'
import { useToast } from '@/hooks/use-toast'

interface UseMarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  height?: string | number
}

export function useMarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  height = '200px'
}: UseMarkdownEditorProps = {}) {
  const [editorValue, setEditorValue] = useState(value)
  const debounceTimeoutRef = useRef<number | null>(null)
  const uploadFileMutation = useUploadFile()
  const { error } = useToast()


  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      // Determine file type based on MIME type
      const getFileType = (mimeType: string): FileType => {
        if (mimeType.startsWith('image/')) return 'image'
        if (mimeType.startsWith('video/')) return 'video'
        if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
        return 'other'
      }

      const fileType = getFileType(file.type)

      const result = await uploadFileMutation.mutateAsync({
        type: fileType,
        file: file
      })

      console.log(`Image uploaded: ${file.name} (${(file.size / 1024).toFixed(1)}KB) -> ${result.data?.url}`)
      return result.data?.url ?? "null"
    } catch (err) {
      error('Image upload failed: ' + err)
      throw err
    }
  }, [uploadFileMutation, error])

  const handleChange = useCallback((val: string) => {
    setEditorValue(val)

    // Debounce the external onChange callback to prevent excessive updates
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      onChange?.(val)
    }, 300)
  }, [onChange])

  // Update editor when value prop changes externally
  useEffect(() => {
    setEditorValue(value)
  }, [value])

  // Update editor when value prop changes externally
  const updateValue = useCallback((newValue: string) => {
    setEditorValue(newValue)
    onChange?.(newValue)
  }, [onChange])

  return {
    value: editorValue,
    onChange: handleChange,
    onImageUpload: handleImageUpload,
    placeholder,
    readOnly,
    height: typeof height === 'number' ? `${height}px` : height,
    updateValue,
    isUploadingImage: uploadFileMutation.isPending
  }
}
