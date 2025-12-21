import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import type { RoadmapDetail } from '@/types/db/roadmap'

interface DeleteRoadmapDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  roadmap: RoadmapDetail | undefined
  isLoading: boolean
}

export function DeleteRoadmapDialog({
  isOpen,
  onClose,
  onConfirm,
  roadmap,
  isLoading,
}: DeleteRoadmapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Roadmap</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this roadmap? This action cannot be undone.
            {roadmap && (
              <span className="block mt-2 font-semibold text-foreground">
                {roadmap.title}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Roadmap
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

