import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface MediaViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt?: string;
  mediaType?: "image" | "video";
  children?: ReactNode;
  className?: string;
}

export const MediaViewer = ({
  open,
  onOpenChange,
  src,
  alt = "Media",
  mediaType = "image",
  children,
  className,
}: MediaViewerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className={cn(
            "flex flex-col items-center justify-center gap-4 border-0 bg-transparent shadow-none w-full max-w-4xl",
            className
          )}
          showCloseButton={true}
        >
          {/* Media Container */}
          <div className="flex items-center justify-center w-full max-h-[80vh] bg-black/20 rounded-lg overflow-hidden backdrop-blur-sm">
            {mediaType === "image" ? (
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video
                src={src}
                controls
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>

          {/* Action Footer */}
          {children && (
            <div className="flex items-center justify-center gap-2 w-full">
              {children}
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
