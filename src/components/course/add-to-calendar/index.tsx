import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAddToCalendarFlow } from "./hook";
import ConnectToGoogle from "./connect-to-google";
import type { UUID } from "@/types/core";

interface AddToCalendarProps {
  courseId: UUID;
}

export default function AddToCalendar({ courseId }: AddToCalendarProps) {
  const {
    handleAddToCalendar,
    handleConnectToGoogle,
    isConnectDialogOpen,
    closeConnectDialog,
    isLoading,
  } = useAddToCalendarFlow();

  return (
    <>
      <Button
        onClick={() => handleAddToCalendar(courseId)}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        {isLoading ? "Adding..." : "Add to Google Calendar"}
      </Button>

      <ConnectToGoogle
        isOpen={isConnectDialogOpen}
        onClose={closeConnectDialog}
        onConnect={handleConnectToGoogle}
        isLoading={isLoading}
      />
    </>
  );
}
