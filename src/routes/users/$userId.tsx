import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/utils";
import { useUser } from "@/hooks/queries/user-hooks";
import { UserDetail } from "@/components/user/user-detail";
import { useAuthState } from "@/hooks/queries/auth-hooks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import type { User } from "@/types/db";
import { NavBar } from "@/components/layout";

export const Route = createFileRoute("/users/$userId")({
  component: RouteComponent,
  beforeLoad: authGuard,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { data, isLoading, error } = useUser(userId);
  const { user: currentUser } = useAuthState();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load user details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const viewedUser = data.data?.user;
  const isOwner = Boolean(currentUser && currentUser.id === viewedUser?.id);

  return (
    <>
      <NavBar />
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4 pt-12">
          <div className="max-w-7xl container mx-auto max-lg:px-4">
            <UserDetail user={viewedUser as User} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </>
  );
}
