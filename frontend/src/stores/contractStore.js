import { create } from 'zustand';
import { contractApi } from '../api/contractApi.js';
import { DASHBOARD_FILTERS } from '../utils/constants.js';

export const useContractStore = create((set, get) => ({
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
  filter: DASHBOARD_FILTERS.ALL,
  nextStatuses: [],

  setFilter: (filter) => {
    set({ filter });
    get().fetchContracts({ status: filter !== DASHBOARD_FILTERS.ALL ? filter : undefined });
  },

  fetchContracts: async (filters = {}) => {
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.getAll(filters);
      set({ 
        contracts: result.data || [],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch contracts',
        loading: false 
      });
    }
  },

  fetchContract: async (id) => {
    set({ loading: true, error: null, currentContract: null });
    
    try {
      const result = await contractApi.getById(id);
      set({ 
        currentContract: result.data,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch contract',
        loading: false 
      });
    }
  },

  createContract: async (contractData) => {
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.create(contractData);
      
      set(state => ({
        contracts: [result.data, ...state.contracts],
        loading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create contract',
        loading: false 
      });
      throw error;
    }
  },

  updateContractFields: async (id, fieldValues) => {
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.updateFields(id, fieldValues);
      
      set(state => ({
        contracts: state.contracts.map(contract => 
          contract._id === id ? result.data : contract
        ),
        currentContract: state.currentContract?._id === id ? result.data : state.currentContract,
        loading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update contract fields',
        loading: false 
      });
      throw error;
    }
  },

  updateContractStatus: async (id, status) => {
    set({ loading: true, error: null });
    
    try {
      const result = await contractApi.updateStatus(id, status);
    set(state => ({
        contracts: state.contracts.map(contract => 
          contract._id === id ? result.data : contract
        ),
        currentContract: state.currentContract?._id === id ? result.data : state.currentContract,
        loading: false,
        nextStatuses: [] 
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to update contract status',
        loading: false 
      });
      throw error;
    }
  },

  fetchNextStatuses: async (id) => {
    set({ loading: true, error: null, nextStatuses: [] });
    
    try {
      const result = await contractApi.getNextStatuses(id);
      set({ 
        nextStatuses: result.data.nextStatuses || [],
        loading: false 
      });
      
      return result.data.nextStatuses;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch next statuses',
        loading: false 
      });
      return [];
    }
  },

  clearCurrentContract: () => {
    set({ currentContract: null, nextStatuses: [] });
  },

  clearError: () => {
    set({ error: null });
  },

  getFilteredContracts: () => {
    const { contracts, filter } = get();
    
    if (filter === DASHBOARD_FILTERS.ALL) return contracts;
    
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

  getContractById: (id) => {
    const { contracts } = get();
    return contracts.find(contract => contract._id === id);
  }
}));