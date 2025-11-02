

import ModuleAccordion from "@/components/course/module-accordion"
import type { Module } from "@/types/db/course/module"
import { useParams } from "@tanstack/react-router"

type ItemsListingProps = {
  modules: Module[]
  onLessonSelect?: (lessonId: string) => void
  defaultExpandedModuleId?: string
}

export default function ItemsListing({
  modules,
  onLessonSelect,
  defaultExpandedModuleId,
}: ItemsListingProps) {
  const { lessonId } = useParams({ from: "/learn/$courseId/$moduleId/$lessonId/" })

  if (!modules || modules.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No modules available</p>
          <p className="text-sm">Course content will appear here once added.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {modules
        .sort((a, b) => a.order - b.order)
        .map((module) => (
          <ModuleAccordion
            key={module.id}
            data={module}
            selectedLessonId={lessonId}
            onLessonSelect={onLessonSelect}
            defaultExpanded={module.id === defaultExpandedModuleId || module.lessons?.some(l => l.id === lessonId)}
          />
        ))}
    </div>
  )
}