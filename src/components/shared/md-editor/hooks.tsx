import { useState, useCallback, useRef, useEffect } from 'react'

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

  // Mock image upload handler - simulates posting blob to backend and getting URL
  const mockImageUpload = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate upload delay (1-3 seconds)
      const delay = Math.random() * 2000 + 1000

      setTimeout(() => {
        // Generate mock URL based on file type and timestamp
        const mockUrl = `https://placehold.co/600x400`
        console.log(`Mock image upload: ${file.name} (${(file.size / 1024).toFixed(1)}KB) -> ${mockUrl}`)
        resolve(mockUrl)
      }, delay)
    })
  }, [])

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const imageUrl = await mockImageUpload(file)
      return imageUrl
    } catch (error) {
      console.error('Mock image upload failed:', error)
      throw new Error('Image upload failed')
    }
  }, [mockImageUpload])

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
    updateValue
  }
}
