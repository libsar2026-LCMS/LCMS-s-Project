-- ============================================================
-- Migration 002 — Row-Level Security Policies
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this file second, after 001_create_tables.sql
-- ============================================================

-- ─── Enable RLS on all tables ───────────────────────────────────────────────

ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings            ENABLE ROW LEVEL SECURITY;

-- ─── Helper function — check current user role ──────────────────────────────

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── users ──────────────────────────────────────────────────────────────────

CREATE POLICY "Users can read own role"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Super admin can manage all users"
  ON public.users FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- ─── profiles ───────────────────────────────────────────────────────────────

CREATE POLICY "Public can read active profiles"
  ON public.profiles FOR SELECT
  USING (membership_status = 'active');

CREATE POLICY "Members can read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Members can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── committees ─────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read active committees"
  ON public.committees FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage committees"
  ON public.committees FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── leadership ─────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read leadership"
  ON public.leadership FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage leadership"
  ON public.leadership FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── events ─────────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read published events"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Members can read all events"
  ON public.events FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── event_registrations ────────────────────────────────────────────────────

CREATE POLICY "Members can read own registrations"
  ON public.event_registrations FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Members can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Members can cancel own registrations"
  ON public.event_registrations FOR DELETE
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage all registrations"
  ON public.event_registrations FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── news ───────────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read published news"
  ON public.news FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── gallery_albums ─────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read published albums"
  ON public.gallery_albums FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage albums"
  ON public.gallery_albums FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── gallery_photos ─────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read photos in published albums"
  ON public.gallery_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.gallery_albums
      WHERE id = gallery_photos.album_id AND is_published = true
    )
  );

CREATE POLICY "Admins can manage photos"
  ON public.gallery_photos FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── documents ──────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read public documents"
  ON public.documents FOR SELECT
  USING (is_public = true);

CREATE POLICY "Members can read all documents"
  ON public.documents FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage documents"
  ON public.documents FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── notifications ──────────────────────────────────────────────────────────

CREATE POLICY "Members can read own notifications"
  ON public.notifications FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Members can update own notifications"
  ON public.notifications FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── contact_messages ───────────────────────────────────────────────────────

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON public.contact_messages FOR SELECT
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.get_user_role() IN ('secretary','president','super_admin'));

-- ─── settings ───────────────────────────────────────────────────────────────

CREATE POLICY "Anyone can read settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage settings"
  ON public.settings FOR ALL
  USING (public.get_user_role() = 'super_admin');

-- ─── Storage: profiles bucket ────────────────────────────────────────────────

CREATE POLICY "Members can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profiles'
    AND auth.uid() IS NOT NULL
    AND name LIKE 'avatars/' || auth.uid()::text || '.%'
  );

CREATE POLICY "Anyone can read profile avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');

CREATE POLICY "Members can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profiles'
    AND auth.uid() IS NOT NULL
    AND name LIKE 'avatars/' || auth.uid()::text || '.%'
  );
