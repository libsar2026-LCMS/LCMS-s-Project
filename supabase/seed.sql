-- ============================================================
-- Seed Data — LCMS
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this after migrations to set up required committees and
-- default system settings. Safe for production.
-- ============================================================

-- Required committees
INSERT INTO public.committees (name, description, is_active) VALUES
  ('Academic Committee', 'Handles academic affairs and scholarships', true),
  ('Sports Committee', 'Organizes sports events and activities', true),
  ('Cultural Committee', 'Preserves Liberian culture and heritage', true),
  ('Welfare Committee', 'Supports member welfare and emergencies', true),
  ('ICT Committee', 'Manages technology and digital systems', true)
ON CONFLICT DO NOTHING;

-- Default settings (update values via Admin > Settings after deployment)
INSERT INTO public.settings (key, value) VALUES
  ('site_name',     '"LIBSAR"'),
  ('contact_email', '"libsar2026@gmail.com"'),
  ('contact_phone', '"+250 000 000 000"'),
  ('founded_year',  '"2015"'),
  ('facebook_url',  '""'),
  ('instagram_url', '""'),
  ('twitter_url',   '""')
ON CONFLICT (key) DO NOTHING;
