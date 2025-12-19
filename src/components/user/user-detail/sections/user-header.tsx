import type { User } from "@/types/db/user";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail, CheckCircle2, Edit2 } from "lucide-react";
import {
  getUserRoleBadgeProps,
  getUserStatusBadgeProps,
} from "@/utils/render-utils";

interface UserHeaderProps {
  user: User;
  isOwner?: boolean;
}

export function UserHeader({ user, isOwner }: UserHeaderProps) {
  const roleProps = getUserRoleBadgeProps(user.role);
  const statusProps = getUserStatusBadgeProps(user.status);

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <AvatarImage
                src={user.profilePicture || undefined}
                alt={user.name}
              />
              <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {isOwner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{user.email}</span>
                {user.emailVerified && (
                  <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                )}
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge
                className={`px-4 py-1 text-xs font-black uppercase tracking-wider ${roleProps.className}`}
                variant={roleProps.variant}
              >
                {roleProps.label}
              </Badge>
              <Badge
                className={`px-4 py-1 text-xs font-black uppercase tracking-wider ${statusProps.className}`}
                variant={statusProps.variant}
              >
                {statusProps.label}
              </Badge>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl font-medium italic">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Action Button */}
          {isOwner && (
            <Button
              asChild
              size="lg"
              className="font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Link to="/settings/profile">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
