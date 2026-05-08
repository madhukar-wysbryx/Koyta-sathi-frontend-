import api from './axios.config';

export const geminiApi = {
  getWelcomeMessage: async (name: string) => {
    const response = await api.post('/gemini/welcome', { name });
    return response.data;
  },
  explainQuiz: async (question: string, userAnswer: string, correctAnswer: string) => {
    const response = await api.post('/gemini/explain-quiz', { question, userAnswer, correctAnswer });
    return response.data;
  },
  getBudgetAdvice: async (spendingData: any) => {
    const response = await api.post('/gemini/budget-advice', spendingData);
    return response.data;
  },
  voiceToExpense: async (voiceText: string) => {
    const response = await api.post('/gemini/voice-to-expense', { voiceText });
    return response.data;
  },
};