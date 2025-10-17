import { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { userService } from '@services/userService';

export function ChangePassword({ }: { userId: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match');
      return;
    }

    try {
      const res = await userService.changePassword(
        currentPassword,
        newPassword,
      );
      setMessage(res.message || 'Password changed successfully!');
    } catch (error : any) {
      setMessage(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2">Account</h1>
      <p className="text-gray-500 mb-4">Edit your account settings and change your password here.</p>
      <hr className="mt-4 mb-8 w-full border-t border-gray-300" />
      {message && <p className="mb-2 text-red-500">{message}</p>}
      <Input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSubmit}>Update Password</Button>
    </div>
  );
}
