import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://koxamdrnnnirmilnogyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveGFtZHJubm5pcm1pbG5vZ3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NjIxNjEsImV4cCI6MjA0ODUzODE2MX0.qBd4vmCTAVV_Ab81VPIEF6rWuT-GyuOr8AqgW1G4jZI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Campaign = {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  roi: number;
  platform: string;
  description: string;
  client_id: string;
  created_at: string;
}

export type Expense = {
  id: string;
  campaign_id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  created_at: string;
}

export type Client = {
  id: string;
  name: string;
  email: string;
  total_budget: number;
  total_spent: number;
  remaining_balance: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}