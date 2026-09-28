/*
  # Re-enable Row Level Security

  The previous migration (20250712180633_shiny_fountain) disabled RLS and granted
  ALL privileges to the public `anon` role on every table. Because the anon key is
  shipped in the browser bundle, that let anyone read, modify or delete all data.

  This migration:
  1. Adds an `is_admin()` helper (SECURITY DEFINER, avoids policy recursion)
  2. Enables RLS on all tables
  3. Public visitors may only INSERT quotes, contact messages and driver applications,
     and READ active services / published blog posts
  4. Logged-in users may read their own profile and their own quotes
  5. Only admins (users.role = 'admin') may read/modify everything else

  To make someone an admin, run in the SQL editor:
    UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin');
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Tighten table privileges (RLS policies below do the fine-grained work)
REVOKE ALL ON users, quote_requests, contact_messages, driver_applications, services, blog_posts FROM anon;
GRANT INSERT ON quote_requests, contact_messages, driver_applications TO anon;
GRANT SELECT ON services, blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, quote_requests, contact_messages, driver_applications, services, blog_posts TO authenticated;

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts          ENABLE ROW LEVEL SECURITY;

-- Drop every existing policy on these tables so we start from a known state
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('users','quote_requests','contact_messages','driver_applications','services','blog_posts')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- users: own profile, may only self-register as 'user' or 'driver'
CREATE POLICY "users_select_own_or_admin" ON users FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin());
CREATE POLICY "users_insert_self" ON users FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role IN ('user', 'driver'));
CREATE POLICY "users_admin_update" ON users FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "users_admin_delete" ON users FOR DELETE TO authenticated
  USING (is_admin());

-- quote_requests: anyone can submit; users see their own; admins manage all
CREATE POLICY "quotes_public_insert" ON quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND (user_id IS NULL OR user_id = auth.uid()));
CREATE POLICY "quotes_select_own_or_admin" ON quote_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR email = (auth.jwt() ->> 'email') OR is_admin());
CREATE POLICY "quotes_admin_update" ON quote_requests FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "quotes_admin_delete" ON quote_requests FOR DELETE TO authenticated
  USING (is_admin());

-- contact_messages: anyone can submit; admins manage
CREATE POLICY "contact_public_insert" ON contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "contact_admin_all" ON contact_messages FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- driver_applications: anyone can submit; admins manage (contains sensitive PII)
CREATE POLICY "drivers_public_insert" ON driver_applications FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
CREATE POLICY "drivers_admin_all" ON driver_applications FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- services: public reads active ones; admins manage
CREATE POLICY "services_public_read" ON services FOR SELECT TO anon, authenticated
  USING (is_active = true OR is_admin());
CREATE POLICY "services_admin_write" ON services FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- blog_posts: public reads published; admins manage
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' OR is_admin());
CREATE POLICY "blog_admin_write" ON blog_posts FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
