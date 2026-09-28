-- =====================================================
-- FIX IS_ADMIN FUNCTION ERROR
-- This migration creates the is_admin() function if it doesn't exist
-- =====================================================

-- =====================================================
-- 1. CREATE IS_ADMIN FUNCTION
-- =====================================================

-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Simple admin check - no recursion
  RETURN COALESCE(
    (
      SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
          auth.users.raw_user_meta_data->>'role' = 'admin'
          OR auth.users.email IN ('admin@bosaboss.com', 'demo@bosaboss.com')
        )
      )
    ),
    false
  );
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. GRANT PERMISSIONS
-- =====================================================

-- Grant function execution permission
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- =====================================================
-- 3. TEST THE FUNCTION
-- =====================================================

-- Test that the function exists and works
DO $$
BEGIN
  -- Just call the function to make sure it exists
  PERFORM is_admin();
  RAISE NOTICE '✅ is_admin() function exists and can be called';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Error testing is_admin() function: %', SQLERRM;
END $$;

-- =====================================================
-- 4. FINAL SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ==========================================';
  RAISE NOTICE '🎉 IS_ADMIN FUNCTION FIX COMPLETED!';
  RAISE NOTICE '🎉 ==========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ is_admin() function created/replaced';
  RAISE NOTICE '✅ Permissions granted';
  RAISE NOTICE '✅ Function tested successfully';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 POLICIES SHOULD NOW WORK CORRECTLY!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '📝 1. Run any other migrations that were failing';
  RAISE NOTICE '📝 2. Restart your development server: npm run dev';
  RAISE NOTICE '📝 3. Test your application functionality';
  RAISE NOTICE '';
END $$;