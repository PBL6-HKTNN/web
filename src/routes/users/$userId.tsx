import { authGuard } from '@/utils'
import { useParams, createFileRoute } from '@tanstack/react-router';
import { useState, useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
import type { User, UserTab } from '@/types';
import { SidebarMenu } from '@components/layout/user-sidebar/SidebarMenu';
import { ProfileContent } from '@components/user/ProfileContent';

export function UserRoute() {
    const { userId } = useParams({ from: Route.id });
    const auth = useContext(AuthContext);

    if (!auth) {
      throw new Error('useAuth must be used within an AuthProvider');
    }

    const { currentUser } = auth;

  const [activeTab, setActiveTab] = useState<UserTab>('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [user, setUser] = useState<User>({
    id: userId || '102220237',
    name: 'Dao Le Hanh Nguyen',
    bio: 'Frontend Developer',
    avatar: 'https://via.placeholder.com/150?text=Avatar',
    contact: { email: 'hanh.nguyen@example.com', phone: '0333414094' },
    birthDate: '2004-12-03',
    motto: 'Keep learning, keep growing',
  });


  // const isCurrentUser = true;
  const isCurrentUser = currentUser?.id === userId;

  const handleEdit = () => { setFormData(user); setIsEditing(true); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      if (name.startsWith('contact.')) {
        const key = name.split('.')[1];
        return { ...prev, contact: { ...prev.contact, [key]: value } };
      }
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
      const form = new FormData();
      form.append('name', formData.name);
      form.append('bio', formData.bio);
      form.append('motto', formData.motto ?? '');
      form.append('birthDate', formData.birthDate ?? '');
      form.append('email', formData.contact.email);
      form.append('phone', formData.contact.phone);
      if (avatarFile) form.append('avatar', avatarFile);

      const response = await fetch(`/api/users/${userId}`, { method: 'PUT', body: form });
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedUser = await response.json();
      
      setUser(updatedUser);
      setIsEditing(false);
      setFormData(updatedUser);
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = () => { setIsEditing(false); setFormData(null); setAvatarFile(null); };

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
      </main>
    </div>
  );
}

export const Route = createFileRoute('/users/$userId')({
  component: UserRoute,
  beforeLoad: authGuard,
});
