import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '@/hooks/queries';
import { changePasswordSchema, type ChangePasswordFormData } from './validator';

export function useChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      
      // Reset form on success
      form.reset();
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  });
  
  return {
    form,
    isChanging: changePasswordMutation.isPending,
    handleSubmit
  };
}