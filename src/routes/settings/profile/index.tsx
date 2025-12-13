import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Calendar, Mail, Clock, Shield, Camera } from 'lucide-react'
import { useAuthState } from '@/hooks/queries'
import { ChangeAvatarForm } from '@/components/user/user-settings/change-avatar-form'
import { ChangeProfileInfoForm } from '@/components/user/user-settings/change-profile-info-form'
import { ChangePasswordForm } from '@/components/user/user-settings/change-password-form'
import type { User as UserType } from '@/types/db'

export const Route = createFileRoute('/settings/profile/')({ 
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthState();
  
  if (!user || !user.id) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }
  
  const fullUser = user as UserType;

  return (
    <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account security.
          </p>
        </div>
        
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Profile</CardTitle>
            <CardDescription>
              Your current profile information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={fullUser.profilePicture || undefined} />
                <AvatarFallback className="text-lg">
                  {fullUser.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{fullUser.email}</span>
                  <Badge variant={fullUser.emailVerified ? "default" : "secondary"}>
                    {fullUser.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                
                {fullUser.name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{fullUser.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {fullUser.createdAt ? new Date(fullUser.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Last updated {fullUser.updatedAt ? new Date(fullUser.updatedAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                
                {fullUser.bio && (
                  <div className="pt-2">
                    <p className="text-sm">{fullUser.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator />
        
        {/* Settings Forms */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <ChangeAvatarForm user={fullUser} />
            <ChangeProfileInfoForm user={fullUser} />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
    </div>
  )
}