import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { UpdateRoadmapReq } from '@/types/db/roadmap'

interface EditRoadmapDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editForm: UpdateRoadmapReq
  onFormChange: (form: UpdateRoadmapReq) => void
  onUpdate: () => void
  isLoading: boolean
}

export function EditRoadmapDialog({
  isOpen,
  onOpenChange,
  editForm,
  onFormChange,
  onUpdate,
  isLoading,
}: EditRoadmapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Roadmap</DialogTitle>
          <DialogDescription>
            Update the roadmap title and description
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={editForm.title}
              onChange={(e) =>
                onFormChange({ ...editForm, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              value={editForm.description}
              onChange={(e) =>
                onFormChange({ ...editForm, description: e.target.value })
              }
              rows={4}
              className={
                editForm.description.trim().length > 0 &&
                editForm.description.trim().length <= 10
                  ? 'border-destructive'
                  : ''
              }
            />
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Description must be more than 10 characters
              </p>
              <span
                className={
                  editForm.description.trim().length <= 10
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }
              >
                {editForm.description.trim().length} / 10+
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Roadmap'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

