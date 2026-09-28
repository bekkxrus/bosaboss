-- =====================================================
-- FIX SUPABASE CONNECTION TIMEOUT AND PERFORMANCE
-- This migration optimizes database performance to prevent timeouts
-- =====================================================

-- =====================================================
-- 1. OPTIMIZE TABLES AND INDEXES
-- =====================================================

-- Analyze tables to update statistics for query planner
ANALYZE users;
ANALYZE quote_requests;
ANALYZE driver_applications;
ANALYZE services;
ANALYZE blog_posts;
ANALYZE contact_messages;

-- Add additional performance indexes
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);
CREATE INDEX IF NOT EXISTS services_category_idx ON services(category);

-- =====================================================
-- 2. OPTIMIZE CONNECTION SETTINGS
-- =====================================================

-- Set statement timeout to prevent long-running queries
ALTER DATABASE CURRENT SET statement_timeout = '30s';

-- Set idle timeout for connections
ALTER DATABASE CURRENT SET idle_in_transaction_session_timeout = '60s';

-- =====================================================
-- 3. VACUUM TABLES TO RECLAIM SPACE AND IMPROVE PERFORMANCE
-- =====================================================

VACUUM ANALYZE users;
VACUUM ANALYZE quote_requests;
VACUUM ANALYZE driver_applications;
VACUUM ANALYZE services;
VACUUM ANALYZE blog_posts;
VACUUM ANALYZE contact_messages;

-- =====================================================
-- 4. TEST CONNECTION PERFORMANCE
-- =====================================================

-- Test query performance
DO $$
DECLARE
    start_time timestamptz;
    end_time timestamptz;
    duration interval;
    test_id uuid;
BEGIN
    -- Start timing
    start_time := clock_timestamp();
    
    -- Run a simple test query
    SELECT id INTO test_id FROM quote_requests LIMIT 1;
    
    -- End timing
    end_time := clock_timestamp();
    duration := end_time - start_time;
    
    RAISE NOTICE 'Query execution time: %', duration;
    
    IF duration < interval '1 second' THEN
        RAISE NOTICE '✅ Query performance is good (under 1 second)';
    ELSE
        RAISE NOTICE '⚠️ Query performance could be improved (over 1 second)';
    END IF;
END $$;

-- =====================================================
-- 5. FINAL SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ==========================================';
    RAISE NOTICE '🎉 CONNECTION TIMEOUT FIX COMPLETED!';
    RAISE NOTICE '🎉 ==========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Database tables optimized';
    RAISE NOTICE '✅ Performance indexes added';
    RAISE NOTICE '✅ Connection settings improved';
    RAISE NOTICE '✅ Tables vacuumed for better performance';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 YOUR CONNECTION SHOULD NOW BE FASTER!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '📝 1. Restart your development server: npm run dev';
    RAISE NOTICE '📝 2. Test the connection on your website';
    RAISE NOTICE '📝 3. Look for improved connection speed';
    RAISE NOTICE '';
END $$;