import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Play, FileText, HelpCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LessonType } from "@/types/db/course/lesson"
import { timeDurationFormat } from "@/utils/time-utils"

interface LessonItemProps {
  title: string
  duration?: string | number
  isSelected: boolean
  onSelected: () => void
  progress?: number // 0-1 range
  indexNum: number
  type: LessonType
  isCompleted?: boolean // Explicit completion status from API
}

const lessonTypeConfig = {
  0: { // MARKDOWN
    icon: FileText,
    label: "Reading",
    color: "text-green-600 dark:text-green-400",
  },
  1: { // VIDEO
    icon: Play,
    label: "Video",
    color: "text-blue-600 dark:text-blue-400",
  },
  2: { // QUIZ
    icon: HelpCircle,
    label: "Quiz",
    color: "text-purple-600 dark:text-purple-400",
  },
} as const

export function LessonItem({
  title,
  duration,
  isSelected,
  onSelected,
  progress,
  indexNum,
  type,
  isCompleted: isCompletedProp,
}: LessonItemProps) {
  const config = lessonTypeConfig[type]
  const Icon = config.icon
  // Use explicit completion status if provided, otherwise fall back to progress
  const isCompleted = isCompletedProp ?? (progress === 1)

  // Convert duration to number if it's a string (assuming it's in seconds)
  const durationNum = typeof duration === 'string' ? parseInt(duration) : duration

 

  return (
    <Item
      variant={isSelected ? "muted" : "default"}
      size="sm"
      className={cn(
        "cursor-pointer transition-all duration-200 hover:bg-accent/50 px-2 py-1.5",
        isSelected && "ring-2 ring-primary/20 bg-primary/5"
      )}
      onClick={onSelected}
    >
      <ItemMedia variant="icon" className="relative">
        <Icon className={cn("size-3", config.color)} />
        {isCompleted && (
          <CheckCircle className="absolute -top-0.5 -right-0.5 size-2.5 text-green-600 dark:text-green-400 bg-white dark:bg-slate-900 rounded-full" />
        )}
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="flex items-center gap-1.5 text-sm">
          <span className="text-xs font-mono text-muted-foreground min-w-[20px]">
            {indexNum.toString().padStart(2, '0')}
          </span>
          <span className="flex-1 truncate text-sm">{title}</span>
        </ItemTitle>

        <ItemDescription className="flex items-center gap-1.5 text-xs">
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            {config.label}
          </Badge>
          {durationNum && (
            <span className="flex items-center gap-0.5 text-muted-foreground text-xs">
              <Clock className="size-2.5" />
              {timeDurationFormat(durationNum)}
            </span>
          )}
        </ItemDescription>

        {progress !== undefined && progress < 1 && (
          <div className="mt-1">
            <Progress value={progress * 100} className="h-0.5 hidden" />
          </div>
        )}
      </ItemContent>

      <ItemActions>
        {isCompleted && (
          <CheckCircle className="size-3 text-green-600 dark:text-green-400" />
        )}
      </ItemActions>
    </Item>
  )
}