import api from './axios.config';

export const priorityApi = {
  getAvailableItems: async () => {
    const response = await api.get('/priority/available');
    return response.data;
  },
  getCurrentPlan: async () => {
    const response = await api.get('/priority/current');
    return response.data;
  },
  createPlan: async (seasonYear: string, items: { itemName: string; estimatedAmount: number }[]) => {
    const response = await api.post('/priority/plan', { seasonYear, items });
    return response.data;
  },
  savePrioritizingGame: async (items: { itemName: string; isMustHave: boolean }[]) => {
    const response = await api.post('/priority/prioritizing-game', { items });
    return response.data;
  },
};