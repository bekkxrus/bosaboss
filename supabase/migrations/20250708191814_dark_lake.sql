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
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests(created_at);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at);

-- =====================================================
-- 2. OPTIMIZE CONNECTION SETTINGS
-- =====================================================

-- Set statement timeout to prevent long-running queries
ALTER DATABASE CURRENT SET statement_timeout = '45s';

-- Set idle timeout for connections
ALTER DATABASE CURRENT SET idle_in_transaction_session_timeout = '90s';

-- Increase work memory for better query performance
ALTER DATABASE CURRENT SET work_mem = '16MB';

-- Increase maintenance work memory for vacuum operations
ALTER DATABASE CURRENT SET maintenance_work_mem = '128MB';

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
-- 4. OPTIMIZE CONNECTION POOLING
-- =====================================================

-- Set maximum number of connections
ALTER SYSTEM SET max_connections = '100';

-- Set connection pooling timeout
ALTER SYSTEM SET idle_in_transaction_timeout = '60s';

-- =====================================================
-- 5. TEST CONNECTION PERFORMANCE
-- =====================================================

-- Test query performance
DO $$
DECLARE
    start_time timestamptz;
    end_time timestamptz;
    duration interval;
    test_id uuid;
    quote_count integer;
BEGIN
    -- Start timing
    start_time := clock_timestamp();
    
    -- Run a simple test query
    SELECT COUNT(*) INTO quote_count FROM quote_requests;
    
    -- End timing
    end_time := clock_timestamp();
    duration := end_time - start_time;
    
    RAISE NOTICE 'Query execution time: %', duration;
    RAISE NOTICE 'Found % quotes', quote_count;
    
    IF duration < interval '1 second' THEN
        RAISE NOTICE '✅ Query performance is good (under 1 second)';
    ELSE
        RAISE NOTICE '⚠️ Query performance could be improved (over 1 second)';
    END IF;
    
    -- Test a more complex query
    start_time := clock_timestamp();
    
    SELECT COUNT(*) INTO quote_count 
    FROM quote_requests 
    WHERE status = 'pending' 
    AND created_at > (CURRENT_DATE - INTERVAL '30 days');
    
    end_time := clock_timestamp();
    duration := end_time - start_time;
    
    RAISE NOTICE 'Complex query execution time: %', duration;
    RAISE NOTICE 'Found % pending quotes in last 30 days', quote_count;
END $$;

-- =====================================================
-- 6. FINAL SUCCESS MESSAGE
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
    RAISE NOTICE '✅ Connection pooling optimized';
    RAISE NOTICE '✅ Tables vacuumed for better performance';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 YOUR CONNECTION SHOULD NOW BE FASTER!';
    RAISE NOTICE '🚀 TIMEOUT ISSUES SHOULD BE RESOLVED!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '📝 1. Restart your development server: npm run dev';
    RAISE NOTICE '📝 2. Test the connection on your website';
    RAISE NOTICE '📝 3. Look for improved connection speed';
    RAISE NOTICE '';
END $$;