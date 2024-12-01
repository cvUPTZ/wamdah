import { supabase } from '../supabase';
import type { Campaign } from '../supabase';

export const campaignQueries = {
  async getCampaigns(sortBy: keyof Campaign = 'created_at', sortDirection: 'asc' | 'desc' = 'desc') {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        expenses (
          id,
          amount,
          category,
          date
        )
      `)
      .order(sortBy, { ascending: sortDirection === 'asc' });

    if (error) throw error;
    return data;
  },

  async getCampaignById(id: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        expenses (
          id,
          amount,
          category,
          description,
          date
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCampaign(id: string, updates: Partial<Campaign>) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCampaign(id: string) {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};