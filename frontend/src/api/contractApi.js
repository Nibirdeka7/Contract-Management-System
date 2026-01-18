import api from './axiosConfig.js';

export const contractApi = {
  // Get all contracts with optional filtering
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
      
      console.log('Fetching contracts from:', url);
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  // Get single contract - ADD THIS FUNCTION
  getById: async (id) => {
    try {
      console.log('Getting contract by ID:', id);
      const response = await api.get(`/contracts/${id}`);
      console.log('Contract response:', response);
      return response;
    } catch (error) {
      console.error('Error getting contract by ID:', error);
      throw error;
    }
  },

  // Create contract from blueprint
  create: async (contractData) => {
    try {
      console.log('Sending contract data:', contractData);
      const response = await api.post('/contracts', contractData);
      console.log('Create contract response:', response);
      return response;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  // Update contract fields
  updateFields: async (id, fieldValues) => {
    try {
      console.log('Updating contract fields:', id, fieldValues);
      const response = await api.put(`/contracts/${id}/fields`, { fieldValues });
      console.log('Update fields response:', response);
      return response;
    } catch (error) {
      console.error('Error updating contract fields:', error);
      throw error;
    }
  },

  // Update contract status
  updateStatus: async (id, status) => {
    try {
      console.log('Updating contract status:', id, status);
      const response = await api.put(`/contracts/${id}/status`, { status });
      console.log('Update status response:', response);
      return response;
    } catch (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  },

  // Get available next statuses
  getNextStatuses: async (id) => {
    try {
      console.log('Getting next statuses for:', id);
      const response = await api.get(`/contracts/${id}/next-statuses`);
      console.log('Next statuses response:', response);
      return response;
    } catch (error) {
      console.error('Error getting next statuses:', error);
      throw error;
    }
  }
};