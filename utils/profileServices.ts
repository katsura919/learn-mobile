import api from "./api";

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


export const getUserById = async (userId: string) => {
    try {
      const res = await api.get(`/user/profile/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      throw err;
    }
};
  

export const updateUser = async (userId: string, data: any) => {
  const res = await api.put(`/users/${userId}`, data);
  return res.data;
};

export const uploadProfilePic = async (userId: string, imageUri: string) => {
  const formData = new FormData();
  const fileName = imageUri.split('/').pop() || 'profile.jpg';
  const fileType = fileName.split('.').pop();

  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: `image/${fileType}`,
  } as any);

  const res = await api.put(`/users/${userId}/upload-profile-pic`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};