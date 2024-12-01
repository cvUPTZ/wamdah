import { create } from 'zustand';
import { supabase, type Campaign } from '../lib/supabase';

interface CampaignStore {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'created_at'>) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ campaigns: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addCampaign: async (campaign) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([campaign])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        campaigns: [data, ...state.campaigns],
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateCampaign: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? data : c)),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));