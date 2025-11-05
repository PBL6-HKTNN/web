import axios from 'axios';
import type { User } from '@/types';

const API_URL = 'http://localhost:5197/api'; 

export const userService = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  },
  updateUser: async (userId: string, updatedUser: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/user/${userId}/profile`, updatedUser);
    return response.data;
  },
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axios.post(`${API_URL}/user/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.avatarUrl; // URL of the uploaded avatar
  },
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/auth/change-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};