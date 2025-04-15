import api from './api';

export const createLesson = async (data: {
  title: string;
  content: string;
  categoryName: string;
}) => {
  const response = await api.post('/lessons', data);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await api.post('/categories', { name });
  return response.data;
};
