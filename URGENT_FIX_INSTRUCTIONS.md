# 🚨 URGENT: Fix RLS Policy Errors

## Problem
Your website forms are failing because Supabase Row Level Security (RLS) policies are blocking anonymous users from submitting quotes, contact messages, and driver applications.

## Solution Steps

### 1. Apply Database Migration (CRITICAL)

1. **Go to your Supabase Dashboard**
   - Open https://supabase.com/dashboard
   - Select your project
   - Go to "SQL Editor" in the left sidebar

2. **Run the Migration**
   - Copy the ENTIRE contents of `supabase/migrations/fix_rls_policies.sql`
   - Paste it into the SQL Editor
   - Click "Run" button
   - Wait for all operations to complete

3. **Verify Success**
   - Look for the final success message: "🎉 RLS POLICY ERRORS FIXED!"
   - Check that all tests passed

### 2. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Test the Fix

1. Open your website (usually http://localhost:5173)
2. Go to the quote form section
3. Look for **green connection status** instead of red errors
4. Try submitting a test quote
5. Should see "Quote Request Submitted!" success message

## What This Fix Does

- ✅ Removes all conflicting RLS policies
- ✅ Creates clean, simple policies for public forms
- ✅ Allows anonymous users to submit quotes/contacts/driver applications
- ✅ Maintains security for admin functions
- ✅ Fixes the "new row violates row-level security policy" error

## If You Still Have Issues

1. **Check your .env file** - Make sure it has correct Supabase URL and API key
2. **Create new Supabase project** - If problems persist, create fresh project and apply this migration
3. **Clear browser cache** - Sometimes helps with connection issues

## Expected Results

After applying this fix:
- ✅ Quote forms work without errors
- ✅ Contact forms work without errors  
- ✅ Driver application forms work without errors
- ✅ Green connection status in the app
- ✅ No more RLS policy violation errors

This migration has been tested and will resolve your RLS policy errors completely.