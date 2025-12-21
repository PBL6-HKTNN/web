import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExternalLink, MoreVertical, Trash2 } from 'lucide-react'
import type { Roadmap } from '@/types/db/roadmap'

interface RoadmapCardProps {
  roadmap: Roadmap
  onDelete: (roadmapId: string) => void
}

export function RoadmapCard({ roadmap, onDelete }: RoadmapCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{roadmap.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {roadmap.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate({ to: `/roadmap/${roadmap.roadmapId}` })}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(roadmap.roadmapId)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{roadmap.progress.toFixed(0)}%</span>
          </div>
          <Progress value={roadmap.progress} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => navigate({ to: `/roadmap/${roadmap.roadmapId}` })}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

