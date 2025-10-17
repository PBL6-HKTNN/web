import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import type { User, UserTab } from '@/types';
import { SidebarMenu } from '@components/layout/user-sidebar/SidebarMenu';
import { ProfileContent } from '@components/user/ProfileContent';
import { ChangePassword } from '@components/user/ChangePassword';
import { userService } from '@/services/userService';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserRouteProps {
  loaderUser: User;
  userId: string;
}

export function UserRoute({ loaderUser, userId }: UserRouteProps) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used within an AuthProvider');

  const { currentUser } = auth;
  const [activeTab, setActiveTab] = useState<UserTab>('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [user, setUser] = useState<User>(loaderUser);

  useEffect(() => {
    setUser(loaderUser);
  }, [loaderUser]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Card className="w-[400px] text-center">
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>
              The user you are looking for might have been deleted or doesn’t exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );

  const isCurrentUser = currentUser?.id === userId;
  // const isCurrentUser = true;

  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => (prev ? { ...prev, avatar: previewUrl } : null));
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const updatedUser = await userService.updateUser(user.id, formData);

      if (avatarFile) {
        const avatarUrl = await userService.uploadAvatar(user.id, avatarFile);
        updatedUser.avatar = avatarUrl;
      }

      setUser(updatedUser);
      setIsEditing(false);
      setFormData(updatedUser);
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
    setAvatarFile(null);
  };

  return (
    <div className="flex max-w-5xl mx-auto my-8 p-8 rounded-lg shadow-lg bg-gray-50">
      <SidebarMenu user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 px-16 w-full">
        {activeTab === 'Profile' && (
          <ProfileContent
            user={user}
            formData={formData}
            isEditing={isEditing}
            isCurrentUser={isCurrentUser}
            handleEdit={handleEdit}
            handleChange={handleChange}
            handleAvatarChange={handleAvatarChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        )}
        {activeTab === 'Account Security' && isCurrentUser && <ChangePassword userId={user.id} />}
      </main>
    </div>
  );
}
