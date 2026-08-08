-- ============================================================
-- Migration 004 — Bootstrap Super Admin
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this ONCE after creating your first user account via
-- /register or Supabase Auth dashboard.
-- Replace <your-user-uuid> with the actual UUID from auth.users.
-- ============================================================

-- Step 1: Find your user UUID
-- SELECT id, email FROM auth.users ORDER BY created_at LIMIT 10;

-- Step 2: Promote to super_admin
-- UPDATE public.users SET role = 'super_admin' WHERE id = '<your-user-uuid>';

-- ─── Seed default system settings ───────────────────────────────────────────

INSERT INTO public.settings (key, value) VALUES
  ('site_name',     '"LIBSAR"'),
  ('contact_email', '"info@libsar.rw"'),
  ('founded_year',  '"2015"'),
  ('facebook_url',  '""'),
  ('instagram_url', '""'),
  ('twitter_url',   '""')
ON CONFLICT (key) DO NOTHING;
