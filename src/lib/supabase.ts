import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// You need to get these values from your Supabase project settings
const supabaseUrl = process.env['REACT_APP_SUPABASE_URL'] || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env['REACT_APP_SUPABASE_ANON_KEY'] || 'placeholder-key';

// Check if we have real credentials
export const hasSupabaseCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

if (!hasSupabaseCredentials) {
  console.warn('Supabase credentials not found in environment variables. Authentication features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'portfolio_manager' | 'trader' | 'viewer';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  if (!hasSupabaseCredentials) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'trader', // default role
      }
    }
  });
  
  if (error) throw error;
  
  // Create profile in database
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'trader',
        permissions: ['view_dashboard', 'execute_trades']
      });
      
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signIn = async (email: string, password: string) => {
  if (!hasSupabaseCredentials) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!hasSupabaseCredentials) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  if (!hasSupabaseCredentials) {
    console.warn('Supabase is not configured.');
    return null;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};