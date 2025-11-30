import { useAuthState } from "@/hooks";
import { UserRole } from "@/types/db";

type RequiredRoleProps = {
    roles: number[];
    children: React.ReactNode;
};

export default function RequiredRole({ roles, children }: RequiredRoleProps) {
    const {
        user
    } = useAuthState();
    if (!user) {
        return <></>;
    }
    if(typeof user?.role !== "number" || !roles.includes(user?.role as UserRole)) {
        return <></>;
    }
    return <>{children}</>;
}