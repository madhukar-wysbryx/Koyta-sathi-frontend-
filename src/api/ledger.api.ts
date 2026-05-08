import api from './axios.config';

export const ledgerApi = {
  getLedger: async () => {
    const response = await api.get('/ledger');
    return response.data;
  },
  addTransaction: async (data: { type: 'taken' | 'repaid'; amount: number; purpose?: string; date: string }) => {
    const response = await api.post('/ledger/entry', data);
    return response.data;
  },
  getWarnings: async () => {
    const response = await api.get('/ledger/warnings');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/ledger/stats');
    return response.data;
  },
};