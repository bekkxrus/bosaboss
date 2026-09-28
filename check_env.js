// =====================================================
// ENVIRONMENT VARIABLES CHECK
// Run this in your browser console on the website
// =====================================================

console.log('=== SUPABASE ENVIRONMENT CHECK ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Check if variables are properly set
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL is missing!');
} else {
  console.log('✅ VITE_SUPABASE_URL is set');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing!');
} else {
  console.log('✅ VITE_SUPABASE_ANON_KEY is set');
}

// Test Supabase connection
import { supabase } from './src/lib/supabase.ts';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('quote_requests').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
    } else {
      console.log('✅ Connection successful:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err);
  }
}

testConnection();