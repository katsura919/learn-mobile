import api from './api';

export const getQuestionsByLesson = async (lessonId: string) => {
  try {
    const response = await api.get(`/questions/lessons/${lessonId}`);
    return response.data.questions;
  } catch (error) {
    throw new Error('Failed to fetch quiz questions.');
  }
};
