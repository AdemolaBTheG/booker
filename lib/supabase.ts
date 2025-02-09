import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Debug log
console.log('Supabase Config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length,
  keyPreview: supabaseAnonKey?.substring(0, 10) + '...',
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;