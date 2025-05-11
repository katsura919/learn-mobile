import api from './api'; 

export const generateQuestions = async (lessonId: string) => {
  try {
    const response = await api.post(`/questions/lessons/${lessonId}/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

// ✅ New: Batch update questions
export const batchUpdateQuestions = async (updates: {
  _id: string;
  questionText: string;
  choices: string[];
  correctAnswer: string;
}[]) => {
  try {
    const response = await api.post('/questions/batch-update', { updates });
    return response.data;
  } catch (error) {
    console.error('Error batch updating questions:', error);
    throw error;
  }
};
