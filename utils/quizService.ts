import api from './api';
import * as SecureStore from 'expo-secure-store';

export const getQuestionsByLesson = async (lessonId: string) => {
  try {
    const response = await api.get(`/questions/lessons/${lessonId}`);
    return response.data.questions;
  } catch (error) {
    throw new Error('Failed to fetch quiz questions.');
  }
};

export const saveLessonAttempt = async (userId: string, lessonId: string, score: number) => {
  const response = await api.post('/attempts', { userId, lessonId, score });
  return response.data;
};
