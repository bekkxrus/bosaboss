-- =====================================================
-- SUPABASE DEBUG AND FIX SQL COMMANDS
-- Run these commands in your Supabase SQL Editor
-- =====================================================

-- 1. CHECK IF TABLES EXIST
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quote_requests', 'users', 'driver_applications', 'services', 'blog_posts', 'contact_messages');

-- 2. CHECK RLS STATUS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('quote_requests', 'users', 'driver_applications', 'services', 'blog_posts', 'contact_messages');

-- 3. CHECK EXISTING POLICIES
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- 4. TEST BASIC INSERT (should work for anonymous users)
INSERT INTO quote_requests (
  pickup_location,
  delivery_location,
  cargo_type,
  company_name,
  contact_name,
  email,
  phone,
  status
) VALUES (
  'Test City, TX',
  'Test Destination, CA',
  'general',
  'Test Company',
  'Test Contact',
  'test@example.com',
  '555-123-4567',
  'pending'
);

-- 5. CHECK IF INSERT WORKED
SELECT COUNT(*) as total_quotes FROM quote_requests;

-- 6. DELETE TEST DATA
DELETE FROM quote_requests WHERE email = 'test@example.com';

-- =====================================================
-- FIX POLICIES IF NEEDED
-- =====================================================

-- Drop existing policies if they're causing issues
DROP POLICY IF EXISTS "Anyone can create quote requests" ON quote_requests;
DROP POLICY IF EXISTS "Users can read own quote requests" ON quote_requests;
DROP POLICY IF EXISTS "Admins can read all quote requests" ON quote_requests;
DROP POLICY IF EXISTS "Admins can update quote requests" ON quote_requests;

-- Create new, more permissive policies for quote_requests
CREATE POLICY "Allow anonymous quote creation" ON quote_requests
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated quote creation" ON quote_requests
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public quote reading" ON quote_requests
  FOR SELECT TO anon, authenticated
  USING (true);

-- For admin access (if you have admin users)
CREATE POLICY "Allow admin full access" ON quote_requests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- ALTERNATIVE: TEMPORARILY DISABLE RLS FOR TESTING
-- =====================================================

-- ONLY USE THIS FOR TESTING - NOT PRODUCTION!
-- ALTER TABLE quote_requests DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- CHECK ENVIRONMENT VARIABLES
-- =====================================================

-- Check if your environment variables are set correctly
-- Run this in your browser console on the website:
-- console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
-- console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

-- =====================================================
-- CREATE ADMIN USER (if needed)
-- =====================================================

-- First, create a user through Supabase Auth, then run:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-admin-email@example.com';

-- =====================================================
-- GRANT PERMISSIONS (if needed)
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT ON quote_requests TO anon, authenticated;
GRANT SELECT, INSERT ON contact_messages TO anon, authenticated;
GRANT SELECT, INSERT ON driver_applications TO anon, authenticated;
GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT ON blog_posts TO anon, authenticated;

-- =====================================================
-- FINAL TEST QUERY
-- =====================================================

-- Test if everything works
DO $$
DECLARE
    test_id uuid;
BEGIN
    -- Try to insert a test quote
    INSERT INTO quote_requests (
        pickup_location,
        delivery_location,
        cargo_type,
        company_name,
        contact_name,
        email,
        phone,
        status
    ) VALUES (
        'Final Test City, TX',
        'Final Test Destination, CA',
        'general',
        'Final Test Company',
        'Final Test Contact',
        'finaltest@example.com',
        '555-999-9999',
        'pending'
    ) RETURNING id INTO test_id;
    
    RAISE NOTICE 'SUCCESS: Test quote inserted with ID: %', test_id;
    
    -- Clean up
    DELETE FROM quote_requests WHERE id = test_id;
    RAISE NOTICE 'SUCCESS: Test quote cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;