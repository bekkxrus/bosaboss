/*
  # Add missing 'user' value to user_role enum
  
  The user_role enum currently only has 'admin', 'driver', 'client' but the application
  expects 'user' as well. This migration adds the missing enum value.
*/

-- Add 'user' value to the user_role enum if it doesn't already exist
DO $$
BEGIN
    -- Check if 'user' value already exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'user' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        -- Add the 'user' value to the enum
        ALTER TYPE user_role ADD VALUE 'user';
        RAISE NOTICE '✅ Added "user" value to user_role enum';
    ELSE
        RAISE NOTICE '✅ "user" value already exists in user_role enum';
    END IF;
END $$;

-- Verify the enum now contains all expected values
DO $$
DECLARE
    enum_values text[];
BEGIN
    SELECT array_agg(enumlabel ORDER BY enumsortorder) INTO enum_values
    FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');
    
    RAISE NOTICE '📋 user_role enum now contains: %', array_to_string(enum_values, ', ');
END $$;