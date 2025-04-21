import api from './api';

export const fetchHomeStats = async (userId: string) => {
  try {
    const [lessonsRes, attemptsRes, avgScoreRes] = await Promise.all([
      api.get(`/lessons/count/${userId}`),
      api.get(`/attempts/user/${userId}`),
      api.get(`/attempts/average/user/${userId}`),
    ]);

    return {
      totalLessons: lessonsRes.data?.total ?? 0,
      totalAttempts: attemptsRes.data?.totalAttempts ?? 0,
      averageScore: avgScoreRes.data?.averageScore ?? 0,
    };
  } catch (error) {
    console.error('Error fetching home stats:', error);
    return {
      totalLessons: 0,
      totalAttempts: 0,
      averageScore: 0,
    };
  }
};

export const fetchLatestLessons = async (userId: string) => {
  try {
    const res = await api.get("/lessons");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching user lessons:", error.response?.data || error.message);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};