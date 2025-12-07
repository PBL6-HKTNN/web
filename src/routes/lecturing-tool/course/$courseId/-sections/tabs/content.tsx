// React is not required for JSX with new transform
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ModuleAccordion from '@/components/course/module-accordion'
import type { Module } from '@/types/db/course/module'
import { Layers, FileText } from 'lucide-react'

interface ContentTabProps {
  modules: Module[]
}

export default function ContentTab({ modules }: ContentTabProps) {
  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>Explore the modules and lessons in this course</CardDescription>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Layers className="size-4" />
              <span>{modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="size-4" />
              <span>{totalLessons} Lessons</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Layers className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No Content Yet</h3>
            <p className="text-muted-foreground">Start by adding your first module.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <ModuleAccordion key={module.id} data={module} defaultExpanded={false} />
            ))}
          </div>
        )}
      </CardContent>
    </>
  )
}
