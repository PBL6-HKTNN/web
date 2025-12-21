import { Button } from "@/components/ui/button";
import { MediaViewer } from "@/components/shared/media-viewer";
import { Download } from "lucide-react";

interface CertificateViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateUrl: string;
  onDownload: () => void;
  isDownloading: boolean;
}

export function CertificateViewerModal({
  open,
  onOpenChange,
  certificateUrl,
  onDownload,
  isDownloading,
}: CertificateViewerModalProps) {
  return (
    <MediaViewer
      open={open}
      onOpenChange={onOpenChange}
      src={certificateUrl}
      alt="Course Completion Certificate"
      mediaType="pdf"
    >
      <Button variant="default" onClick={onDownload} disabled={isDownloading}>
        <Download className="w-4 h-4 mr-2" />
        {isDownloading ? "Downloading..." : "Download Certificate"}
      </Button>
    </MediaViewer>
  );
}
