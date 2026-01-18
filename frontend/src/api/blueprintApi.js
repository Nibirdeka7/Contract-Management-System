import api from './axiosConfig.js';

export const blueprintApi = {
  // Get all blueprints
  getAll: async () => {
    try {
      const response = await api.get('/blueprints');
      return response; // Direct return, no .data here
    } catch (error) {
      throw error;
    }
  },

  // Get single blueprint
  getById: async (id) => {
    try {
      const response = await api.get(`/blueprints/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create blueprint
  create: async (blueprintData) => {
    try {
      const response = await api.post('/blueprints', blueprintData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};