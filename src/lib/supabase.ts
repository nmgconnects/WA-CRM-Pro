import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Workspace = {
  id: string;
  name: string;
  created_at: string;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  status: 'lead' | 'contact' | 'customer' | 'archived';
  workspace_id: string;
  created_at: string;
};

export type Note = {
  id: string;
  contact_id: string;
  content: string;
  created_at: string;
};
