"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useChangeAvatarForm } from "./hook";
import type { User } from "@/types/db";

interface ChangeAvatarFormProps {
  user: User;
}

export function ChangeAvatarForm({ user }: ChangeAvatarFormProps) {
  const {
    selectedFile,
    previewUrl,
    isUploading,
    handleFileSelect,
    handleSubmit,
    fileInputRef
  } = useChangeAvatarForm({ user });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">
          Upload a new profile picture. Recommended size is 400x400px.
        </p>
      </div>
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || user.profilePicture || undefined} />
          <AvatarFallback className="text-lg">
            {user.email?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Label htmlFor="avatar-upload" className="sr-only">
            Choose avatar
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      </div>
      
      {selectedFile && (
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Update Profile Picture'
          )}
        </Button>
      )}
    </div>
  );
}