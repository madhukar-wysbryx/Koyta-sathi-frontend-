// src/api/auth.api.ts
import api from './axios.config';

export const authApi = {
  signup: async (data: {
    phoneNumber: string;
    password: string;
    name: string;
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