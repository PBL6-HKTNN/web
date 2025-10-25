"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ContentTreeSidebar } from "./content-tree-sb";
import { CurrentSelectedSidebar } from "./current-selected-sb";

interface CourseEditLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function CourseEditLayout({ open, onOpenChange, children, isLoading = false }: CourseEditLayoutProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1600px] !container h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Edit Course Content</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 h-full overflow-hidden">
          {/* Left Sidebar - Content Tree */}
          <Card className="col-span-1 border-r border-t-0 border-l-0 border-b-0 rounded-none flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ContentTreeSidebar isLoading={isLoading} />
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="col-span-3 overflow-hidden p-4">
            {children}
          </div>

          {/* Right Sidebar - Current Selected Info */}
          <Card className="col-span-1 border-l border-t-0 border-r-0 border-b-0 rounded-none flex flex-col">
            <div className="flex-1 overflow-hidden">
              <CurrentSelectedSidebar isLoading={isLoading} />
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
