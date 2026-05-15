import api from './axios.config';

export const pastSeasonApi = {
  getPastSeasons: async () => {
    const response = await api.get('/past-season');
    return response.data;
  },
  addPastSeason: async (data: { seasonYear: string; advanceTaken: number; daysWorked: number; arrearsAmount: number; advancePendingAtStart: number }) => {
    const response = await api.post('/past-season', data);
    return response.data;
  },
  getSeasonOptions: async () => {
    const response = await api.get('/past-season/options');
    return response.data;
  },
};