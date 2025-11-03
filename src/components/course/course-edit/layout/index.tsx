"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentTreeSidebar } from "./content-tree-sb";
import { CurrentSelectedSidebar } from "./current-selected-sb";
import { useCourseEdit } from "@/contexts/course/course-edit";
import { ConfirmDeleteModal } from "../modals/confirm-del";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface CourseEditLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function CourseEditLayout({ open, onOpenChange, children, isLoading = false }: CourseEditLayoutProps) {
  const { isDeleteModalOpen, deleteTarget, closeDeleteModal, confirmDelete } = useCourseEdit();

  const getDeleteModalContent = () => {
    if (!deleteTarget) return { title: '', description: '' };

    if (deleteTarget.type === 'module') {
      return {
        title: 'Delete Module',
        description: 'Are you sure you want to delete this module? This action cannot be undone and will also delete all lessons within this module.',
      };
    } else {
      return {
        title: 'Delete Lesson',
        description: 'Are you sure you want to delete this lesson? This action cannot be undone.',
      };
    }
  };

  const modalContent = getDeleteModalContent();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1600px] !container h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Edit Course Content</DialogTitle>
        </DialogHeader>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar - Content Tree */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r flex flex-col bg-background">
              <ContentTreeSidebar isLoading={isLoading} />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Content Area */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full overflow-auto p-4 bg-background">
              {children}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Sidebar - Current Selected Info */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-l flex flex-col bg-background">
              <CurrentSelectedSidebar isLoading={isLoading} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={modalContent.title}
        description={modalContent.description}
      />
    </Dialog>
  );
}
