import api from './axios.config';

export const priorityApi = {
  getCurrentPlan: async () => {
    const response = await api.get('/priority/current');
    return response.data;
  },
  createPlan: async (seasonYear: string, items: { itemName: string; estimatedAmount: number }[], priorityAdvanceAmount?: number) => {
    const response = await api.post('/priority/plan', { seasonYear, items, priorityAdvanceAmount });
    return response.data;
  },
  savePrioritizingGame: async (items: { itemName: string; isMustHave: boolean }[]) => {
    const response = await api.post('/priority/prioritizing-game', { items });
    return response.data;
  },
  downloadBudgetPdf: async () => {
    const response = await api.get('/priority/budget-pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'koyta-sathi-budget-plan.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};