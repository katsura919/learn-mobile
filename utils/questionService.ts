import api from './api'; // your configured Axios instance

export const generateQuestions = async (lessonId: string) => {
    try {
      const response = await api.post(`/questions/lessons/${lessonId}/generate`);
      return response.data;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  };
  