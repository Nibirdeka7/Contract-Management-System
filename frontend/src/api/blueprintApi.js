import api from './axiosConfig.js';

export const blueprintApi = {
  getAll: async () => {
    try {
      const response = await api.get('/blueprints');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/blueprints/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (blueprintData) => {
    try {
      const response = await api.post('/blueprints', blueprintData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};