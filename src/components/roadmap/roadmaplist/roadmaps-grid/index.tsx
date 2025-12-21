import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Map, Plus } from 'lucide-react'
import { RoadmapCard } from '../roadmap-card'
import type { Roadmap } from '@/types/db/roadmap'

interface RoadmapsGridProps {
  isLoading: boolean
  roadmaps: Roadmap[]
  onCreateClick: () => void
  onDelete: (roadmapId: string) => void
}

export function RoadmapsGrid({
  isLoading,
  roadmaps,
  onCreateClick,
  onDelete,
}: RoadmapsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (roadmaps.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Map className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No roadmaps yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Create your first roadmap to organize your learning journey
          </p>
          <Button onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Roadmap
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roadmaps.map((roadmap) => (
        <RoadmapCard
          key={roadmap.roadmapId}
          roadmap={roadmap}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

