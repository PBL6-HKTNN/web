import { createFileRoute } from '@tanstack/react-router'
import { RoadmapDetail } from '@/components/roadmap/roadmap-detail'

export const Route = createFileRoute('/roadmap/$roadmapId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { roadmapId } = Route.useParams()
  return <RoadmapDetail roadmapId={roadmapId} />
}
