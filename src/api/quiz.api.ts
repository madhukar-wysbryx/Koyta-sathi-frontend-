import api from './axios.config';

export const quizApi = {
  getQuestions: async () => {
    const response = await api.get('/quiz/questions');
    return response.data;
  },
  submitQuiz: async (answers: Record<string, string>) => {
    const response = await api.post('/quiz/submit', { answers });
    return response.data;
  },
  getResults: async () => {
    const response = await api.get('/quiz/results');
    return response.data;
  },
};