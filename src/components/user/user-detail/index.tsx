import type { User } from '@/types/db/user'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Mail, BookOpen, Award, CheckCircle2, Edit2 } from 'lucide-react'
import { getUserRoleBadgeProps, getUserStatusBadgeProps } from '@/utils/render-utils'

interface UserDetailProps {
  user: User
  isOwner?: boolean
}

export function UserDetail({ user, isOwner }: UserDetailProps) {
  const roleProps = getUserRoleBadgeProps(user.role)
  const statusProps = getUserStatusBadgeProps(user.status)

  return (
    <div className="w-full min-w-7xl space-y-4">
      {/* Header Card with Avatar and Basic Info */}
      <Card className=''>
        <CardHeader className="pb-6">
          <div className="flex items-start gap-6">
            {/* Avatar Section */}
            <Avatar className="w-24 h-24 border-4 border-primary/10">
              <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info Section */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  {user.emailVerified && (
                    <div title="Email verified">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className={`px-2 py-0.5 font-medium ${roleProps.className}`} variant={roleProps.variant}>
                  {roleProps.label}
                </Badge>
                <Badge className={`px-2 py-0.5 font-medium ${statusProps.className}`} variant={statusProps.variant}>
                  {statusProps.label}
                </Badge>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{user.bio}</p>
              )}
            </div>

            {/* Action Button */}
            {isOwner && (
              <Button asChild size="sm" className="gap-2">
                <Link to="/settings/profile">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Courses Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{user.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{(user.rating ?? 0).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold capitalize">
                  {user.status === 0 ? 'Active' : user.status === 1 ? 'Inactive' : 'Pending'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Additional Information</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Member ID</span>
              <span className="text-sm font-medium font-mono">{user.id}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email Verified</span>
              <Badge variant={user.emailVerified ? 'secondary' : 'outline'}>
                {user.emailVerified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Login Failures</span>
              <span className="text-sm font-medium">{user.totalLoginFailures}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDetail
