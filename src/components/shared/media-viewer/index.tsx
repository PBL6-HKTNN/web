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
  mediaType?: "image" | "video" | "pdf";
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
            "flex flex-col items-center justify-center gap-4 border-0 bg-transparent shadow-none w-full lg:min-w-7xl max-w-4xl",
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
            ) : mediaType === "video" ? (
              <video
                src={src}
                controls
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              // Certificates/PDFs should render in a responsive landscape frame
              <div
                className={cn(
                  "w-full max-w-7xl aspect-video rounded-md overflow-hidden bg-black"
                )}
              >
                <iframe
                  src={src}
                  title={alt}
                  style={{
                    transform: "scale(0.8)",
                    transformOrigin: "0 0",
                    width: "125%",
                    height: "125%",
                  }}
                  frameBorder="0"
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
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
