import { supabase } from './supabase';
const CREATE_PROFILES_TABLE = `
-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy to allow users to select their own profile
CREATE POLICY "Users can select their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
`;

const CREATE_USERS_TABLE = `
-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT, -- Optional full name
  avatar_url TEXT, -- Optional avatar URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own user details
CREATE POLICY "Users can select their own user details"
ON users FOR SELECT
USING (auth.uid() = id);
`;

const CREATE_CLIENTS_TABLE = `
-- Create the clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  total_budget NUMERIC NOT NULL,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  remaining_balance NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy to allow specific users to view or manage clients
CREATE POLICY "Admins can manage clients"
ON clients FOR ALL
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');
`;

const CREATE_CAMPAIGNS_TABLE = `
-- Create the campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  budget NUMERIC NOT NULL,
  spent NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  roi NUMERIC NOT NULL DEFAULT 0,
  platform TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id), -- Added client_id as a foreign key
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view and manage their own campaigns
CREATE POLICY "Clients can manage their own campaigns"
ON campaigns FOR ALL
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);
`;

const CREATE_EXPENSES_TABLE = `
-- Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE, -- Foreign key for campaigns
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy to allow campaign owners to manage their expenses
CREATE POLICY "Campaign owners can manage their expenses"
ON expenses FOR ALL
USING (auth.uid() = (SELECT client_id FROM campaigns WHERE campaigns.id = campaign_id))
WITH CHECK (auth.uid() = (SELECT client_id FROM campaigns WHERE campaigns.id = campaign_id));
`;


export async function initializeDatabase() {
  try {
    // Check if the profiles table exists by making a simple query
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.code === 'PGRST204') {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc('run_sql', {
        sql: CREATE_PROFILES_TABLE + CREATE_USERS_TABLE + CREATE_CLIENTS_TABLE + CREATE_CAMPAIGNS_TABLE + CREATE_EXPENSES_TABLE
      });

      if (createError) {
        console.error('Failed to create tables:', createError);
        throw createError;
      } else {
        console.log('Database initialized successfully');
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
