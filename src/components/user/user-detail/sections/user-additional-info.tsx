import type { User } from "@/types/db/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Fingerprint, History } from "lucide-react";

interface UserAdditionalInfoProps {
  user: User;
}

export function UserAdditionalInfo({ user }: UserAdditionalInfoProps) {
  return (
    <Card className="border-none shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Fingerprint className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Member ID
              </span>
            </div>
            <p className="text-sm font-mono font-bold bg-muted p-2 rounded-md break-all">
              {user.id}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Verification
              </span>
            </div>
            <div>
              <Badge
                variant={user.emailVerified ? "secondary" : "outline"}
                className="font-bold"
              >
                {user.emailVerified ? "Email Verified" : "Email Not Verified"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <History className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Security
              </span>
            </div>
            <p className="text-sm font-bold">
              {user.totalLoginFailures} Login Failures
            </p>
          </div>
        </div>

        <Separator className="opacity-50" />

        <div className="text-xs text-muted-foreground font-medium italic">
          Member since{" "}
          {new Date(user.createdAt as string | Date).toLocaleDateString(
            "vi-VN",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}
