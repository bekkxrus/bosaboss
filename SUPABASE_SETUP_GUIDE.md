# 🚀 Supabase Setup Guide

## The Problem
You're getting "infinite recursion detected in policy for relation 'users'" because the Row Level Security (RLS) policies are referencing each other in a loop.

## 🔧 Quick Fix Steps

### 1. Run the Fix Migration
Go to your Supabase Dashboard → SQL Editor and run the `fix_rls_policies.sql` file I created. This will:
- Remove all problematic policies
- Create simple, non-recursive policies
- Fix the infinite recursion issue

### 2. Set Up Environment Variables
Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these values from:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings → API**
4. Copy **Project URL** and **anon/public key**

### 3. Restart Development Server
```bash
npm run dev
```

## 🧪 Test the Fix

### In Browser Console:
```javascript
// Check environment variables
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Check the Quote Form:
1. Go to `/quote` page
2. You should see "✅ Database connection and permissions working"
3. Try submitting a test quote

## 🔍 What the Fix Does

### Before (Problematic):
```sql
-- This caused infinite recursion
CREATE POLICY "Admins can read all users" ON users
  USING (
    EXISTS (
      SELECT 1 FROM users  -- ❌ This references the same table!
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### After (Fixed):
```sql
-- This uses auth.users instead of our users table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users  -- ✅ Uses Supabase's auth table
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
$$;
```

## 🎯 Expected Results

After running the fix:
- ✅ Quote form works without errors
- ✅ No more "infinite recursion" errors
- ✅ Connection status shows green
- ✅ Forms can submit successfully

## 🆘 If Still Having Issues

1. **Check Supabase Status**: https://status.supabase.com/
2. **Verify Project URL**: Make sure it ends with `.supabase.co`
3. **Check API Key**: Should start with `eyJ`
4. **Browser Console**: Look for any remaining errors

## 📞 Alternative Contact Methods

If the forms still don't work, users can:
- Call: (555) 123-4567
- Email: quotes@bosaboss.com
- Telegram: @Bosaboss_CEO
- Phone: 407-777-2772

The website will show these fallback options automatically if there are database issues.