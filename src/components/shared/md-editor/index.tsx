import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useMarkdownEditor } from './hooks'
import MDEditor from '@uiw/react-md-editor'
import './styles.css'
import { useTheme } from '@/contexts/theme'
import { commands, type ICommand } from '@uiw/react-md-editor'
import { ImagePlus } from 'lucide-react'

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  height?: string | number
}

const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  className,
  height = '200px',
  ...props
}, ref) => {
  const { value: editorValue, onChange: handleChange, onImageUpload, height: editorHeight } = useMarkdownEditor({
    value,
    onChange,
    placeholder,
    readOnly,
    height
  })
  const { theme } = useTheme();

  const customImageCommand: ICommand = {
    name: 'image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': 'Insert image' },
    icon: (
      <ImagePlus size={12}/>
    ),
    execute: async (_state, api) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.click()

      input.onchange = async () => {
        const file = input.files?.[0]
        if (file) {
          try {
            const imageUrl = await onImageUpload(file)
            const imageMarkdown = `![${file.name}](${imageUrl})`
            api.replaceSelection(imageMarkdown)
          } catch (error) {
            console.error('Image upload failed:', error)
          }
        }
      }
    },
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-full",
        className
      )}
      {...props}
    >
      <MDEditor
        value={editorValue}
        onChange={(val) => handleChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        height="100%"
        className="w-full h-full"
        data-color-mode={theme as 'light' | 'dark'}
        textareaProps={{
          placeholder,
          style: {
            minHeight: editorHeight,
            maxHeight: 'none',
            overflowY: 'auto',
          }
        }}
        previewOptions={{
          className: "prose prose-sm max-w-none dark:prose-invert",
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.divider,
          commands.link,
          customImageCommand,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.divider,
          commands.code,
          commands.codeBlock,
          commands.quote,
          commands.divider,
        ]}
      />
    </div>
  )
})

MarkdownEditor.displayName = 'MarkdownEditor'

export { MarkdownEditor, type MarkdownEditorProps }
