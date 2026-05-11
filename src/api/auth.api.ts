import api from './axios.config';

export const authApi = {
  signup: async (data: {
    phoneNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    village: string;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (phoneNumber: string, password: string) => {
    const response = await api.post('/auth/login', { phoneNumber, password });
    return response.data;
  },
};
