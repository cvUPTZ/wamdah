import { create } from 'zustand';
import type { Client } from '../lib/supabase';
import { clientQueries } from '../lib/queries/clientQueries';

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  selectedClient: Client | null;
  fetchClients: (sortBy?: keyof Client, sortDirection?: 'asc' | 'desc') => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (client: Omit<Client, 'id' | 'created_at'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  loading: false,
  error: null,
  selectedClient: null,

  fetchClients: async (sortBy = 'name', sortDirection = 'asc') => {
    set({ loading: true });
    try {
      const data = await clientQueries.getClients(sortBy, sortDirection);
      set({ clients: data, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch clients' });
    } finally {
      set({ loading: false });
    }
  },

  fetchClientById: async (id) => {
    set({ loading: true });
    try {
      const data = await clientQueries.getClientById(id);
      set({ selectedClient: data, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch client' });
    } finally {
      set({ loading: false });
    }
  },

  createClient: async (client) => {
    try {
      const data = await clientQueries.createClient(client);
      set((state) => ({
        clients: [data, ...state.clients],
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create client' });
      throw error;
    }
  },

  updateClient: async (id, updates) => {
    try {
      const data = await clientQueries.updateClient(id, updates);
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? data : c)),
        selectedClient: state.selectedClient?.id === id ? data : state.selectedClient,
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update client' });
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      await clientQueries.deleteClient(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        error: null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete client' });
      throw error;
    }
  },
}));