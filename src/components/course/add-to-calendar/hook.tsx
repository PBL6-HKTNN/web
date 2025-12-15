import { useState } from "react";
import { useAddToCalendar } from "@/hooks/queries/course/enrollment-hooks";
import { useGetRefreshToken } from "@/hooks/queries/auth-hooks";
import type { UUID } from "@/types/core";
import { toast } from "sonner";

export function useAddToCalendarFlow() {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<UUID>("");
  const addToCalendarMutation = useAddToCalendar();
  const getRefreshTokenMutation = useGetRefreshToken();

  const handleAddToCalendar = async (courseId: UUID) => {
    setCurrentCourseId(courseId);

    try {
      const response = await addToCalendarMutation.mutateAsync(courseId);

      if (response.isSuccess && response.data && response.data.length > 0) {
        // Open first calendar URL in new tab
        toast.success("Added to calendar successfully!");
        window.open(response.data[0], "_blank");
      }
    } catch (error: unknown) {
      // Check if it's a 400 error (need to connect Google account)
      if (
        (error as { response?: { status: number } }).response?.status === 400 ||
        (error as { status?: number }).status === 400
      ) {
        setIsConnectDialogOpen(true);
      } else {
        console.error("Failed to add to calendar:", error);
      }
    }
  };

  const handleConnectToGoogle = async () => {
    try {
      const response = await getRefreshTokenMutation.mutateAsync();

      if (response.isSuccess && response.data) {
        // Open Google OAuth URL in new window
        const width = 540;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open(
          response.data,
          "popup",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        setIsConnectDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to get Google OAuth URL:", error);
    }
  };

  const closeConnectDialog = () => {
    setIsConnectDialogOpen(false);
    setCurrentCourseId("");
  };

  return {
    handleAddToCalendar,
    handleConnectToGoogle,
    isConnectDialogOpen,
    closeConnectDialog,
    isLoading:
      addToCalendarMutation.isPending || getRefreshTokenMutation.isPending,
    currentCourseId,
  };
}
