import api from './api';

export const permitService = {
  getAll: async () => {
    const response = await api.get('/permits');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/permits/${id}`);
    return response.data;
  },

  create: async (permitData) => {
    const response = await api.post('/permits', permitData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/permits/${id}`, updates);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.post(`/permits/${id}/approve`);
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await api.post(`/permits/${id}/reject`, { reason });
    return response.data;
  }
};