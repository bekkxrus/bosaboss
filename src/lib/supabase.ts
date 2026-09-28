import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// More robust environment variable checking
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.warn('Please create a .env file with your Supabase credentials');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'bosaboss-auth-token',
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Test connection function with better error handling and shorter timeout
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Log the URL being used (without the key for security)
    console.log('Using Supabase URL:', supabaseUrl);
    
    // Test with a simple query
    const { data, error } = await supabase
      .from('quote_requests')
      .select('count')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);

      // Check if it's an authentication error
      if (error.message.includes('Invalid API key') || error.code === 'PGRST301') {
        console.error('❌ Invalid API key. Please check your VITE_SUPABASE_ANON_KEY in the .env file.');
        return { 
          success: false, 
          error: 'Invalid API key. Please check your .env file and ensure it has the correct VITE_SUPABASE_ANON_KEY.' 
        };
      }
      
      // Provide specific error guidance
      if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        return { success: false, error: 'Invalid Supabase API key. Please check your VITE_SUPABASE_ANON_KEY in the .env file.' };
      } else if (error.message.includes('Project not found') || error.message.includes('404')) {
        return { success: false, error: 'Supabase project not found. Please check your VITE_SUPABASE_URL in the .env file.' };
      } else if (error.message.includes('infinite recursion')) {
        return { success: false, error: 'Database policy error. Please run the migration in Supabase Dashboard.' };
      } else if (error.code === 'PGRST116') {
        return { success: false, error: 'Database tables not found. Please run the migration in Supabase Dashboard.' };
      } else if (error.code === '42501') {
        return { success: false, error: 'Database policy error. Please run the migration in Supabase Dashboard.' };
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'Network error. Please check your internet connection and Supabase project status.' };
      } else {
        return { success: false, error: `Connection failed: ${error.message}` };
      }
    }
    
    console.log('✅ Supabase connection test successful');
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Supabase connection test error:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('timeout')) {
      console.error('Network error details:', error);
      return {
        success: false,
        error: 'Network error. Please check your internet connection and verify your Supabase project is active.'
      };
    }
    return { 
      success: false, 
      error: error.message || 'Unknown connection error' 
    };
  }
};

// Test quote insertion with minimal data and better error handling
export const testQuoteInsertion = async () => {
  try {
    console.log('🧪 Testing quote insertion with minimal data...');
    const testQuote = {
      pickup_location: 'Test Origin TX',
      delivery_location: 'Test Destination FL',
      cargo_type: 'test',
      company_name: 'Test Company',
      contact_name: 'Test User',
      email: `test-${Date.now()}@example.com`, // Unique email to avoid conflicts
      phone: '555-123-4567',
      status: 'pending' as const,
    };

    const { data, error: supabaseError } = await supabase
      .from('quote_requests')
      .insert(testQuote)
      .select();

    if (supabaseError) {
      console.error('❌ Quote insertion test failed:', supabaseError);
      console.error('Error details:', supabaseError);
      
      // Provide specific error guidance
      if (supabaseError.code === 'PGRST116') {
        return { success: false, error: 'quote_requests table not found. Please run database migrations in Supabase Dashboard.' };
      } else if (supabaseError.code === '42501') {
        return { success: false, error: 'Database policy error. Please run the migration in Supabase Dashboard.' };
      } else if (supabaseError.message && supabaseError.message.includes('infinite recursion')) {
        return { success: false, error: 'Database policy error. Please run the migration in Supabase Dashboard.' };
      } else {
        return { success: false, error: `Insert failed: ${supabaseError.message}` };
      }
    }

    console.log('✅ Quote insertion test successful:', data);
    
    // Clean up test data
    if (data && data[0]) {
      await supabase
        .from('quote_requests')
        .delete()
        .eq('id', data[0].id);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Quote insertion test error:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error during quote insertion test' 
    };
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'driver' | 'client';
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: 'admin' | 'driver' | 'client';
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'driver' | 'client';
          phone?: string | null;
          updated_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          user_id: string | null;
          pickup_location: string;
          delivery_location: string;
          cargo_type: string;
          weight: string | null;
          dimensions: string | null;
          pickup_date: string | null;
          delivery_date: string | null;
          service_type: string;
          special_requirements: string | null;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string;
          status: 'pending' | 'approved' | 'rejected';
          amount: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          pickup_location: string;
          delivery_location: string;
          cargo_type: string;
          weight?: string | null;
          dimensions?: string | null;
          pickup_date?: string | null;
          delivery_date?: string | null;
          service_type?: string;
          special_requirements?: string | null;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string;
          status?: 'pending' | 'approved' | 'rejected';
          amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          pickup_location?: string;
          delivery_location?: string;
          cargo_type?: string;
          weight?: string | null;
          dimensions?: string | null;
          pickup_date?: string | null;
          delivery_date?: string | null;
          service_type?: string;
          special_requirements?: string | null;
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string;
          status?: 'pending' | 'approved' | 'rejected';
          amount?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      driver_applications: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          cdl_number: string;
          cdl_class: string;
          cdl_expiration: string;
          experience_years: string;
          truck_type: string;
          trailer_type: string;
          insurance_carrier: string;
          policy_number: string;
          mc_number: string | null;
          dot_number: string | null;
          preferred_lanes: string | null;
          home_base: string;
          available_date: string;
          cdl_document_url: string | null;
          insurance_document_url: string | null;
          mc_authority_url: string | null;
          w9_document_url: string | null;
          status: 'pending' | 'under_review' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          cdl_number: string;
          cdl_class: string;
          cdl_expiration: string;
          experience_years: string;
          truck_type: string;
          trailer_type: string;
          insurance_carrier: string;
          policy_number: string;
          mc_number?: string | null;
          dot_number?: string | null;
          preferred_lanes?: string | null;
          home_base: string;
          available_date: string;
          cdl_document_url?: string | null;
          insurance_document_url?: string | null;
          mc_authority_url?: string | null;
          w9_document_url?: string | null;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          cdl_number?: string;
          cdl_class?: string;
          cdl_expiration?: string;
          experience_years?: string;
          truck_type?: string;
          trailer_type?: string;
          insurance_carrier?: string;
          policy_number?: string;
          mc_number?: string | null;
          dot_number?: string | null;
          preferred_lanes?: string | null;
          home_base?: string;
          available_date?: string;
          cdl_document_url?: string | null;
          insurance_document_url?: string | null;
          mc_authority_url?: string | null;
          w9_document_url?: string | null;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          category: 'trucking' | 'dispatching';
          description: string;
          features: string[];
          price: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'trucking' | 'dispatching';
          description: string;
          features?: string[];
          price?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'trucking' | 'dispatching';
          description?: string;
          features?: string[];
          price?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          status: 'draft' | 'published';
          publish_date: string;
          read_time: string | null;
          featured_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          status?: 'draft' | 'published';
          publish_date?: string;
          read_time?: string | null;
          featured_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          category?: string;
          status?: 'draft' | 'published';
          publish_date?: string;
          read_time?: string | null;
          featured_image_url?: string | null;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          inquiry_type: string;
          status: 'new' | 'read' | 'responded';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          inquiry_type?: string;
          status?: 'new' | 'read' | 'responded';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          inquiry_type?: string;
          status?: 'new' | 'read' | 'responded';
        };
      };
    };
  };
}