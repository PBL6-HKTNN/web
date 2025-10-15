import React from 'react';
import type { User } from '@/types';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';

interface ProfileContentProps {
  user: User;
  formData: User | null;
  isEditing: boolean;
  isCurrentUser: boolean;
  handleEdit: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export function ProfileContent({
  user,
  formData,
  isEditing,
  isCurrentUser,
  handleEdit,
  handleChange,
  handleAvatarChange,
  handleSave,
  handleCancel,
}: ProfileContentProps) {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2">Public Profile</h1>
      <p className="text-gray-500 mb-4">Add information to help others know you better.</p>
      <hr className="mt-4 mb-4 w-full border-t border-gray-300" />

      {/* Avatar */}
      <div className="flex items-center mb-4">
        <img
          src={isEditing ? formData?.avatar || user.avatar : user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border border-gray-300 mr-4"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm w-50% border border-gray-300 rounded-lg px-3 py-2 focus:outline-indigo-500"
          />
        )}
      </div>

      {/* Info Form */}
      <div className="space-y-5 w-full">
        {[
          { label: 'Full Name', name: 'name', value: formData?.name ?? user.name },
          { label: 'Birth Date', name: 'birthDate', value: formData?.birthDate ?? user.birthDate, type: 'date' },
          { label: 'Headline', name: 'bio', value: formData?.bio ?? user.bio },
          { label: 'Biography', name: 'motto', value: formData?.motto ?? user.motto, textArea: true },
          { label: 'Email', name: 'contact.email', value: formData?.contact.email ?? user.contact.email },
          { label: 'Phone Number', name: 'contact.phone', value: formData?.contact.phone ?? user.contact.phone },
        ].map((row) => (
          <FormRow
            key={row.name}
            label={row.label}
            name={row.name}
            value={row.value || ''}
            onChange={handleChange}
            isEditing={isEditing}
            textArea={row.textArea}
            type={row.type as any}
          />
        ))}
      </div>

      {/* Action Buttons */}
      {isCurrentUser && (
        <div className="mt-8 flex space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      )}
    </div>
  );
}

function FormRow({
  label,
  name,
  value,
  onChange,
  isEditing,
  textArea,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing: boolean;
  textArea?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        textArea ? (
          <Textarea
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-indigo-500"
          />
        ) : (
          <Input
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-indigo-500"
          />
        )
      ) : (
        <p className="text-gray-800">{value || '-'}</p>
      )}
    </div>
  );
}
