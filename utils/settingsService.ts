import api from "./api";
import { Alert } from 'react-native';
import { ChangePasswordPayload } from "./type";
import *  as ImagePicker from 'expo-image-picker';

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.user;
};


export const updateUserProfile = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data.data;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePic: string;
};

type UploadProfilePicResponse = {
  success: boolean;
  data: User;
  message?: string; // Add message to response type
};

// In your api.ts (simplified version)
export const uploadProfilePic = async (userId: string, image: any) => {
  try {
    const uri = image.uri;
    const filename = uri.split('/').pop() || `profile.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await api.post(`/users/${userId}/profile-pic`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.log('[UPLOAD ERROR]', {
      error: error.response?.data || error.message,
      userId,
      imageUri: image?.uri,
      imageType: image?.type,
    });
    throw error;
  }
};



export const changePassword = async (payload: ChangePasswordPayload) => {
    try {
      const response = await api.patch(`/users/${payload.userId}/change-password`, {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
    
      console.log(payload.userId, payload.currentPassword, payload.newPassword);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to change password.";
      throw new Error(message);
    }
  };
  