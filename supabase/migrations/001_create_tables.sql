-- ============================================================
-- Migration 001 — Create Tables
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this file first in Supabase SQL Editor
-- ============================================================

-- Users (extends auth.users with role)
CREATE TABLE public.users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'member'
               CHECK (role IN ('visitor','member','committee_head','secretary','president','super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Committees (created before profiles due to FK)
CREATE TABLE public.committees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  head_id     uuid, -- FK added after profiles table
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Profiles (core member record)
CREATE TABLE public.profiles (
  id                      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_id           varchar UNIQUE,
  full_name               text NOT NULL DEFAULT '',
  gender                  text CHECK (gender IN ('male','female','other')),
  phone                   text,
  profile_photo_url       text,
  county                  text,
  date_joined             date,
  membership_status       text DEFAULT 'active'
                            CHECK (membership_status IN ('active','inactive','suspended','alumni')),
  university              text,
  department              text,
  academic_level          text CHECK (academic_level IN ('undergraduate','postgraduate','phd','alumni')),
  committee_id            uuid REFERENCES public.committees(id) ON DELETE SET NULL,
  skills                  text[],
  emergency_contact_name  text,
  emergency_contact_phone text,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- Add head_id FK to committees now that profiles exists
ALTER TABLE public.committees
  ADD CONSTRAINT committees_head_id_fkey
  FOREIGN KEY (head_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Leadership
CREATE TABLE public.leadership (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  position      text NOT NULL,
  academic_year text NOT NULL,
  is_current    boolean DEFAULT false,
  photo_url     text,
  bio           text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Events
CREATE TABLE public.events (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                    text NOT NULL,
  slug                     text UNIQUE NOT NULL,
  description              text,
  event_type               text DEFAULT 'other'
                             CHECK (event_type IN ('meeting','sports','cultural','community_service','social','other')),
  status                   text DEFAULT 'draft'
                             CHECK (status IN ('draft','published','cancelled')),
  start_datetime           timestamptz NOT NULL,
  end_datetime             timestamptz,
  location                 text,
  cover_image_url          text,
  is_registration_required boolean DEFAULT false,
  max_attendees            integer,
  created_by               uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now()
);
-- Event Registrations
CREATE TABLE public.event_registrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended      boolean DEFAULT false,
  registered_at timestamptz DEFAULT now(),
  UNIQUE (event_id, profile_id)
);

-- News
CREATE TABLE public.news (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  content         text,
  category        text DEFAULT 'announcement'
                    CHECK (category IN ('announcement','scholarship','community','graduation','achievement')),
  status          text DEFAULT 'draft'
                    CHECK (status IN ('draft','published')),
  cover_image_url text,
  author_id       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Gallery Albums
CREATE TABLE public.gallery_albums (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description     text,
  cover_photo_url text,
  is_published    boolean DEFAULT false,
  created_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Gallery Photos
CREATE TABLE public.gallery_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  url         text NOT NULL,
  caption     text,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

-- Documents
CREATE TABLE public.documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  category    text DEFAULT 'other'
                CHECK (category IN ('constitution','report','minutes','form','certificate','strategic_plan','other')),
  file_url    text NOT NULL,
  file_size   integer,
  is_public   boolean DEFAULT true,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text NOT NULL,
  message    text,
  is_read    boolean DEFAULT false,
  link       text,
  created_at timestamptz DEFAULT now()
);

-- Contact Messages
CREATE TABLE public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Settings
CREATE TABLE public.settings (
  key        varchar PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX idx_profiles_membership_status ON public.profiles(membership_status);
CREATE INDEX idx_profiles_university ON public.profiles(university);
CREATE INDEX idx_profiles_committee_id ON public.profiles(committee_id);

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX idx_events_slug ON public.events(slug);

CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_category ON public.news(category);

CREATE INDEX idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- ─── Seed default settings ──────────────────────────────────────────────────

INSERT INTO public.settings (key, value) VALUES
  ('site_name',    '"LIBSAR Community Management System"'),
  ('site_tagline', '"Liberians in Rwanda — United, Empowered, Thriving"'),
  ('contact_email','"libsar2026@gmail.com"'),
  ('contact_phone','"+250 000 000 000"'),
  ('social_links', '{"facebook": "", "instagram": "", "twitter": "", "whatsapp": ""}'),
  ('founded_year', '"2021"')
ON CONFLICT (key) DO NOTHING;

-- ─── Storage bucket for profile photos ──────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;
