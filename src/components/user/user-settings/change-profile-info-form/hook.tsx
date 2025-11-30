import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile } from '@/hooks/queries';
import { profileInfoSchema, type ProfileInfoFormData } from './validator';
import type { User } from '@/types/db';

interface UseChangeProfileInfoFormProps {
  user: User;
}

export function useChangeProfileInfoForm({ user }: UseChangeProfileInfoFormProps) {
  const updateProfileMutation = useUpdateProfile();
  
  const form = useForm<ProfileInfoFormData>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: user.name || '',
      bio: user.bio || ''
    }
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user.id) return;
    
    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        data: {
          name: data.name || undefined,
          bio: data.bio || undefined
        }
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  });
  
  return {
    form,
    isUpdating: updateProfileMutation.isPending,
    handleSubmit
  };
}