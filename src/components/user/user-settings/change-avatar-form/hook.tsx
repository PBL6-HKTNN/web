import { useState, useRef } from 'react';
import { useChangeAvatar } from '@/hooks/queries';
import type { User } from '@/types/db';

interface UseChangeAvatarFormProps {
  user: User;
}

export function useChangeAvatarForm({ user }: UseChangeAvatarFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const changeAvatarMutation = useChangeAvatar();
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile || !user.id) return;
    
    try {
      await changeAvatarMutation.mutateAsync({
        userId: user.id,
        data: { file: selectedFile }
      });
      
      // Reset form on success
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };
  
  return {
    selectedFile,
    previewUrl,
    isUploading: changeAvatarMutation.isPending,
    handleFileSelect,
    handleSubmit,
    fileInputRef
  };
}