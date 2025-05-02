import api from './api';
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const getUserLessons = async () => {
  try {
    const res = await api.get("/lessons");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user lessons:", error.response?.data || error.message);
    return [];
  }
};

export const fetchLessonsByCategory = async (categoryId: string) => {
  try {
    const res = await api.get(`/lessons/category/${categoryId}`);
    return res.data.data || []; 
  } catch (err) {
    console.error('Error fetching lessons by category:', err);
    return []; 
  }
};


export const getLessonById = async (id: string) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) throw new Error("Unauthorized");
  
    const response = await api.get(`/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };

  export const updateLesson = async (id: string, payload: { title: string; content: string }) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) throw new Error("Unauthorized");
  
    const response = await api.put(`/lessons/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };
  
  export const deleteLesson = async (id: string) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) throw new Error("Unauthorized");
  
    const response = await api.delete(`/lessons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };

