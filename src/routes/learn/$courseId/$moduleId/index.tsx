import { createFileRoute } from '@tanstack/react-router'
import { ModuleInfo } from '@/components/course/course-learn/content-render/module-info'
import { useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/learn/$courseId/$moduleId/')({
  component: RouteComponent,
})

function ModuleContent() {
  const { moduleId } = useParams({ from: "/learn/$courseId/$moduleId/" })

  return (
    <ModuleInfo moduleId={moduleId} />
  )
}

function RouteComponent() {
  return <ModuleContent />
}
