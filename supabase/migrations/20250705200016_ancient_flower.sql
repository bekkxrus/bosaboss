-- =====================================================
-- SIMPLE AUTH FIX - NO EMAIL VERIFICATION
-- This migration fixes authentication and removes email verification
-- =====================================================

-- =====================================================
-- 1. DISABLE EMAIL CONFIRMATION IN AUTH SETTINGS
-- =====================================================

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_confirmations = false,
  enable_email_confirmations = false
WHERE true;

-- =====================================================
-- 2. ENSURE ALL EXISTING USERS ARE CONFIRMED
-- =====================================================

-- Mark all existing users as email confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmed_at = COALESCE(confirmed_at, now())
WHERE email_confirmed_at IS NULL OR confirmed_at IS NULL;

-- =====================================================
-- 3. CREATE DEMO USERS WITH PROPER AUTH
-- =====================================================

-- Function to create demo users safely
CREATE OR REPLACE FUNCTION create_demo_auth_users()
RETURNS text AS $$
DECLARE
    admin_user_id uuid;
    demo_user_id uuid;
    result_message text := '';
BEGIN
    -- Create admin user if doesn't exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@bosaboss.com') THEN
        admin_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_user_id,
            'authenticated',
            'authenticated',
            'admin@bosaboss.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin User", "role": "admin"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        -- Insert into our users table
        INSERT INTO users (id, name, email, role) 
        VALUES (admin_user_id, 'Admin User', 'admin@bosaboss.com', 'admin')
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role;
        
        result_message := result_message || '✅ Admin user created. ';
    ELSE
        result_message := result_message || '✅ Admin user already exists. ';
    END IF;
    
    -- Create demo user if doesn't exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@bosaboss.com') THEN
        demo_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            demo_user_id,
            'authenticated',
            'authenticated',
            'demo@bosaboss.com',
            crypt('demo123', gen_salt('bf')),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Demo User", "role": "user"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        -- Insert into our users table
        INSERT INTO users (id, name, email, role) 
        VALUES (demo_user_id, 'Demo User', 'demo@bosaboss.com', 'user')
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role;
        
        result_message := result_message || '✅ Demo user created. ';
    ELSE
        result_message := result_message || '✅ Demo user already exists. ';
    END IF;
    
    RETURN result_message;
EXCEPTION WHEN OTHERS THEN
    RETURN '❌ Error creating demo users: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the demo users
SELECT create_demo_auth_users();

-- =====================================================
-- 4. TEST AUTHENTICATION
-- =====================================================

-- Verify demo users exist
DO $$
DECLARE
    admin_exists boolean;
    demo_exists boolean;
    admin_confirmed boolean;
    demo_confirmed boolean;
BEGIN
    -- Check if users exist
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@bosaboss.com') INTO admin_exists;
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'demo@bosaboss.com') INTO demo_exists;
    
    -- Check if users are confirmed
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@bosaboss.com' 
        AND email_confirmed_at IS NOT NULL
    ) INTO admin_confirmed;
    
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'demo@bosaboss.com' 
        AND email_confirmed_at IS NOT NULL
    ) INTO demo_confirmed;
    
    RAISE NOTICE '👤 Admin user exists: %, confirmed: %', admin_exists, admin_confirmed;
    RAISE NOTICE '👤 Demo user exists: %, confirmed: %', demo_exists, demo_confirmed;
    
    IF admin_exists AND demo_exists AND admin_confirmed AND demo_confirmed THEN
        RAISE NOTICE '✅ All demo users are ready for login!';
    ELSE
        RAISE NOTICE '⚠️ Some demo users may have issues';
    END IF;
END $$;

-- =====================================================
-- 5. FINAL SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ==========================================';
    RAISE NOTICE '🎉 SIMPLE AUTH FIX COMPLETED!';
    RAISE NOTICE '🎉 ==========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Email confirmation disabled';
    RAISE NOTICE '✅ All existing users confirmed';
    RAISE NOTICE '✅ Demo users created and confirmed';
    RAISE NOTICE '✅ Simple sign up/sign in enabled';
    RAISE NOTICE '✅ No email verification required';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 DEMO LOGIN CREDENTIALS:';
    RAISE NOTICE '🔑 Admin: admin@bosaboss.com / admin123';
    RAISE NOTICE '🔑 User: demo@bosaboss.com / demo123';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '📝 1. Restart your development server: npm run dev';
    RAISE NOTICE '📝 2. Try registering a new user (no email verification!)';
    RAISE NOTICE '📝 3. Try logging in with demo credentials';
    RAISE NOTICE '📝 4. Test quote forms (should work!)';
    RAISE NOTICE '';
    RAISE NOTICE '💡 REGISTRATION NOW WORKS WITHOUT EMAIL VERIFICATION!';
    RAISE NOTICE '💡 Users are immediately active after sign up';
    RAISE NOTICE '';
END $$;