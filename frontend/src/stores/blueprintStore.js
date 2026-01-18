import { create } from 'zustand';
import { blueprintApi } from '../api/blueprintApi.js';

export const useBlueprintStore = create((set, get) => ({
  
  blueprints: [],
  currentBlueprint: null,
  loading: false,
  error: null,

  fetchBlueprints: async () => {
    set({ loading: true, error: null });
    
    try {
      const result = await blueprintApi.getAll();
      set({ 
        blueprints: result.data || [],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch blueprints',
        loading: false 
      });
    }
  },

  fetchBlueprint: async (id) => {
    set({ loading: true, error: null, currentBlueprint: null });
    
    try {
      const result = await blueprintApi.getById(id);
      set({ 
        currentBlueprint: result.data,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch blueprint',
        loading: false 
      });
    }
  },

  createBlueprint: async (blueprintData) => {
    set({ loading: true, error: null });
    
    try {
      const result = await blueprintApi.create(blueprintData);
            set(state => ({
        blueprints: [result.data, ...state.blueprints],
        loading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create blueprint',
        loading: false 
      });
      throw error;
    }
  },

  clearCurrentBlueprint: () => {
    set({ currentBlueprint: null });
  },

  clearError: () => {
    set({ error: null });
  },

  getBlueprintById: (id) => {
    const { blueprints } = get();
    return blueprints.find(blueprint => blueprint._id === id);
  }
}));