import axios from 'axios';
import type { User } from '@/types';

const API_URL = 'https://....com/api'; 

export const userService = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  },
  updateUser: async (userId: string, updatedUser: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${userId}`, updatedUser);
    return response.data;
  },
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axios.post(`${API_URL}/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.avatarUrl; // URL of the uploaded avatar
  },
};