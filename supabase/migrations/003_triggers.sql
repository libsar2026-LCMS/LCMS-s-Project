-- ============================================================
-- Migration 003 — Triggers
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this file third, after 002_rls_policies.sql
-- ============================================================

-- ─── Auto-create user + profile on signup ───────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into users table with default role
  INSERT INTO public.users (id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (id) DO NOTHING;

  -- Insert into profiles table with name from metadata
  INSERT INTO public.profiles (id, full_name, date_joined)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CURRENT_DATE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── Auto-update updated_at ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_committees_updated_at
  BEFORE UPDATE ON public.committees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_leadership_updated_at
  BEFORE UPDATE ON public.leadership
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_gallery_albums_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Auto-generate membership ID ────────────────────────────────────────────
-- Format: LIBSAR-YYYY-XXXX (e.g. LIBSAR-2024-0001)

CREATE OR REPLACE FUNCTION public.generate_membership_id()
RETURNS trigger AS $$
DECLARE
  year_part text;
  seq_part  text;
  count_num integer;
BEGIN
  IF NEW.membership_id IS NULL THEN
    year_part := to_char(CURRENT_DATE, 'YYYY');
    SELECT COUNT(*) + 1 INTO count_num
    FROM public.profiles
    WHERE membership_id LIKE 'LIBSAR-' || year_part || '-%';
    seq_part := lpad(count_num::text, 4, '0');
    NEW.membership_id := 'LIBSAR-' || year_part || '-' || seq_part;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_membership_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_membership_id();
