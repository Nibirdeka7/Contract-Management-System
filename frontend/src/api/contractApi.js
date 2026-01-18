import api from './axiosConfig.js';

export const contractApi = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.blueprintId) {
        params.append('blueprintId', filters.blueprintId);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/contracts?${queryString}` : '/contracts';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (contractData) => {
    try {
      const response = await api.post('/contracts', contractData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateFields: async (id, fieldValues) => {
    try {
      const response = await api.put(`/contracts/${id}/fields`, { fieldValues });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/contracts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNextStatuses: async (id) => {
    try {
      const response = await api.get(`/contracts/${id}/next-statuses`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};