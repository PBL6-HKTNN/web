import { Button } from '@/components/ui/button'
import { Map, Plus } from 'lucide-react'

interface RoadmapListHeaderProps {
  onCreateClick: () => void
}

export function RoadmapListHeader({ onCreateClick }: RoadmapListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Map className="w-8 h-8" />
          My Roadmaps
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your learning roadmaps
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="w-4 h-4 mr-2" />
        Create Roadmap
      </Button>
    </div>
  )
}

