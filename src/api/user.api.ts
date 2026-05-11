import api from './axios.config';

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: { firstName: string; lastName: string; village: string }) => {
    const response = await api.post('/user/profile', data);
    return response.data;
  },

  completeOnboarding: async () => {
    const response = await api.post('/user/complete-onboarding');
    return response.data;
  },
};
