// services/categoryService.ts
import API from './api';

export const updateCategory = async (id: string, name: string) => {
  try {
    const response = await API.put(`/categories/${id}`, { name });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Something went wrong while updating the category.' };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Something went wrong while deleting the category.' };
  }
};
