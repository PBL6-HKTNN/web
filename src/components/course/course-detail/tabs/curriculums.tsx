import type { Module } from '@/types/db/course/module'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ModuleAccordion from '@/components/course/module-accordion'

interface CurriculumProps {
  modules: Module[]
}

export default function CurriculumTab({ modules }: CurriculumProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Course content</CardTitle>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-muted-foreground">No modules found for this course.</div>
        ) : (
          <div>
            {modules.map(module => (
              <ModuleAccordion key={module.id} data={module} defaultExpanded={false} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
