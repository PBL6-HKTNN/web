import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Clock, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { LessonItem } from "@/components/course/lesson-item"
import type { Module } from "@/types/db/course/module"
import { timeDurationFormat } from "@/utils/time-utils"

type ModuleAccordionProps = {
  data: Module
  selectedLessonId?: string
  onLessonSelect?: (lessonId: string) => void
  defaultExpanded?: boolean
}

export default function ModuleAccordion({
  data,
  selectedLessonId,
  onLessonSelect,
  defaultExpanded = false,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded)

  const handleLessonSelect = (lessonId: string) => {
    onLessonSelect?.(lessonId)
  }

  return (
    <div className="w-full border border-border rounded-none shadow-none">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer hover:bg-accent/50 transition-colors px-3 py-2 border-b border-border">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-left">{data.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3" />
                        {data.numLessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {timeDurationFormat(data.duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Module {data.order}
                </Badge>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isOpen && "transform rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 py-2">
            <div className="space-y-1">
              {data.lessons
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    title={lesson.title}
                    duration={lesson.duration}
                    isSelected={selectedLessonId === lesson.id}
                    onSelected={() => handleLessonSelect(lesson.id)}
                    progress={0.5} // Mock progress - in real app this would come from user progress data
                    indexNum={lesson.orderIndex}
                    type={lesson.lessonType}
                  />
                ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}