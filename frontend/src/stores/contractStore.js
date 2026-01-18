import { create } from 'zustand';
import { contractApi } from '../api/contractApi.js';
import { DASHBOARD_FILTERS } from '../utils/constants.js';

export const useContractStore = create((set, get) => ({
  // State
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
  filter: DASHBOARD_FILTERS.ALL,
  nextStatuses: [],

  // Actions
  setFilter: (filter) => {
    console.log('Setting filter:', filter);
    set({ filter });
  },

  // Fetch all contracts
  fetchContracts: async (filters = {}) => {
    console.log('Fetching contracts with filters:', filters);
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.getAll(filters);
      console.log('Contracts fetched:', result);
      set({ 
        contracts: result.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      set({ 
        error: error.message || 'Failed to fetch contracts',
        loading: false 
      });
    }
  },

  // Fetch single contract - FIXED: Add this function
  fetchContract: async (id) => {
    console.log('Fetching contract:', id);
    set({ loading: true, error: null, currentContract: null });
    
    try {
      const result = await contractApi.getById(id);
      console.log('Contract fetched:', result);
      set({ 
        currentContract: result.data,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching contract:', error);
      set({ 
        error: error.message || 'Failed to fetch contract',
        loading: false 
      });
    }
  },

  // Create new contract
  createContract: async (contractData) => {
    console.log('Creating contract with data:', contractData);
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.create(contractData);
      console.log('Contract created:', result);
      
      // Add new contract to list
      set(state => ({
        contracts: [result.data, ...state.contracts],
        loading: false
      }));
      
      return result.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      set({ 
        error: error.message || 'Failed to create contract',
        loading: false 
      });
      throw error;
    }
  },

  // Update contract fields
  updateContractFields: async (id, fieldValues) => {
    console.log('Updating contract fields:', id, fieldValues);
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.updateFields(id, fieldValues);
      
      // Update in contracts list
      set(state => ({
        contracts: state.contracts.map(contract => 
          contract._id === id ? result.data : contract
        ),
        // Update current contract if it's the one being viewed
        currentContract: state.currentContract?._id === id ? result.data : state.currentContract,
        loading: false
      }));
      
      console.log('Fields updated successfully');
      return result.data;
    } catch (error) {
      console.error('Error updating contract fields:', error);
      set({ 
        error: error.message || 'Failed to update contract fields',
        loading: false 
      });
      throw error;
    }
  },

  // Update contract status
  updateContractStatus: async (id, status) => {
    console.log('Updating contract status:', id, status);
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.updateStatus(id, status);
      
      // Update in contracts list
      set(state => ({
        contracts: state.contracts.map(contract => 
          contract._id === id ? result.data : contract
        ),
        // Update current contract if it's the one being viewed
        currentContract: state.currentContract?._id === id ? result.data : state.currentContract,
        loading: false,
        nextStatuses: [] // Clear cached next statuses
      }));
      
      console.log('Status updated successfully');
      return result.data;
    } catch (error) {
      console.error('Error updating contract status:', error);
      set({ 
        error: error.message || 'Failed to update contract status',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch available next statuses
  fetchNextStatuses: async (id) => {
    console.log('Fetching next statuses for contract:', id);
    set({ loading: true, error: null, nextStatuses: [] });
    
    try {
      const result = await contractApi.getNextStatuses(id);
      const nextStatuses = result.data?.nextStatuses || [];
      set({ 
        nextStatuses,
        loading: false 
      });
      
      console.log('Next statuses:', nextStatuses);
      return nextStatuses;
    } catch (error) {
      console.error('Error fetching next statuses:', error);
      set({ 
        error: error.message || 'Failed to fetch next statuses',
        loading: false 
      });
      return [];
    }
  },

  // Clear current contract (for when leaving detail page)
  clearCurrentContract: () => {
    console.log('Clearing current contract');
    set({ currentContract: null, nextStatuses: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Computed getters (selectors)
  getFilteredContracts: () => {
    const { contracts, filter } = get();
    
    if (filter === DASHBOARD_FILTERS.ALL) return contracts;
    
    // Apply filters based on dashboard requirements
    if (filter === DASHBOARD_FILTERS.ACTIVE) {
      return contracts.filter(c => ['CREATED', 'APPROVED', 'SENT'].includes(c.status));
    }
    
    if (filter === DASHBOARD_FILTERS.PENDING) {
      return contracts.filter(c => ['CREATED', 'APPROVED'].includes(c.status));
    }
    
    if (filter === DASHBOARD_FILTERS.SIGNED) {
      return contracts.filter(c => ['SIGNED', 'LOCKED'].includes(c.status));
    }
    
    return contracts;
  },

  // Get contract by ID (useful for quick lookups)
  getContractById: (id) => {
    const { contracts } = get();
    return contracts.find(contract => contract._id === id);
  }
}));