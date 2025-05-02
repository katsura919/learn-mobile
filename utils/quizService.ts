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


export const saveQuizAttempt = async (
  lessonId: string,
  score: number,
  totalItems: number,
  correctAnswers: string[]
) => {
  const userData = await SecureStore.getItemAsync('userData');
  if (!userData) throw new Error('User not logged in');

  const { id: userId } = JSON.parse(userData);

  const payload = {
    userId,
    lessonId,
    score,
    totalItems,
    correctAnswers,
  };

  return api.post('/attempts', payload); 
};