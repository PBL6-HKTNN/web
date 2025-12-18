import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

interface ConnectToGoogleProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  isLoading?: boolean;
}

export default function ConnectToGoogle({
  isOpen,
  onClose,
  onConnect,
  isLoading = false,
}: ConnectToGoogleProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Connect to Google Calendar
          </DialogTitle>
          <DialogDescription>
            To add this course to your Google Calendar, you need to connect your
            Google account first. This will allow us to create calendar events
            for your course schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-muted-foreground">
              After connecting, you'll be able to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Add course schedules to your calendar</li>
              <li>• Get reminders for upcoming lessons</li>
              <li>• Sync with your existing calendar events</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConnect}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            {isLoading ? "Connecting..." : "Connect Google Calendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
