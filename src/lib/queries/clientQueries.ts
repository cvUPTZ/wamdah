import { supabase } from '../supabase';
import type { Client } from '../supabase';

export const clientQueries = {
  async getClients(sortBy: keyof Client = 'name', sortDirection: 'asc' | 'desc' = 'asc') {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        campaigns (
          id,
          name,
          status,
          budget,
          spent
        )
      `)
      .order(sortBy, { ascending: sortDirection === 'asc' });

    if (error) throw error;
    return data;
  },

  async getClientById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        campaigns (
          id,
          name,
          status,
          budget,
          spent,
          roi,
          platform
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createClient(client: Omit<Client, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};