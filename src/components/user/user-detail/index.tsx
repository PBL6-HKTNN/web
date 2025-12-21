import type { User } from "@/types/db/user";
import { UserHeader } from "./sections/user-header";
import { UserStats } from "./sections/user-stats";
import { UserAdditionalInfo } from "./sections/user-additional-info";

interface UserDetailProps {
  user: User;
  isOwner?: boolean;
}

export function UserDetail({ user, isOwner }: UserDetailProps) {
  return (
    <div className="w-full mx-auto space-y-8 pb-12">
      <UserHeader user={user} isOwner={isOwner} />
      <UserStats user={user} />
      <UserAdditionalInfo user={user} />
    </div>
  );
}

export default UserDetail;
