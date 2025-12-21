import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowLeft, Edit, Trash2, Plus, MoreVertical, Map } from 'lucide-react'
import type { RoadmapDetail } from '@/types/db/roadmap'

interface RoadmapHeaderProps {
  roadmap: RoadmapDetail
  onEdit: () => void
  onAddCourse: () => void
  onDelete: () => void
}

export function RoadmapHeader({
  roadmap,
  onEdit,
  onAddCourse,
  onDelete,
}: RoadmapHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/roadmap' })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Map className="w-8 h-8" />
            {roadmap.title}
          </h1>
          <p className="text-muted-foreground mt-1">{roadmap.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {roadmap.isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Roadmap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddCourse}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Roadmap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

