# Database Design — LCMS

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Tables](#3-tables)
4. [Row-Level Security Policies](#4-row-level-security-policies)
5. [Database Triggers](#5-database-triggers)
6. [Indexes](#6-indexes)

---

## 1. Design Principles

- UUIDs as primary keys (Supabase default via `gen_random_uuid()`)
- `created_at` and `updated_at` on every table
- Soft deletes via `deleted_at` where appropriate
- Row-Level Security (RLS) enabled on every table
- Foreign keys enforced at the database level
- Enums used for constrained value fields

---

## 2. Entity Relationship Diagram

```
auth.users ──────────────────── profiles
                                    │
                ┌───────────────────┼───────────────────────┐
                │                   │                       │
           committees           leadership          event_registrations
                │                                           │
           profiles (head_id)                           events
                                                           │
                                                   profiles (created_by)

profiles ──── news (author_id)
profiles ──── gallery_albums (created_by)
gallery_albums ──── gallery_photos
profiles ──── gallery_photos (uploaded_by)
profiles ──── documents (uploaded_by)
profiles ──── notifications
profiles ──── leadership (profile_id)
profiles ──── committees (head_id)
```

---

## 3. Tables

---

### auth.users
Managed entirely by Supabase Auth. Do not create or modify this table manually.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| email | text | User email |
| created_at | timestamptz | Auto-set |

---

### users
Extends auth.users with application-level role.

```sql
CREATE TABLE public.users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'member'
               CHECK (role IN ('visitor','member','committee_head','secretary','president','super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

### profiles
Core member record. One row per registered member.

```sql
CREATE TABLE public.profiles (
  id                      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_id           varchar UNIQUE,
  full_name               text NOT NULL,
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
```

---

### committees

```sql
CREATE TABLE public.committees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  head_id     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

---

### leadership

```sql
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
```

---

### events

```sql
CREATE TABLE public.events (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   text NOT NULL,
  slug                    text UNIQUE NOT NULL,
  description             text,
  event_type              text DEFAULT 'other'
                            CHECK (event_type IN ('meeting','sports','cultural','community_service','social','other')),
  status                  text DEFAULT 'draft'
                            CHECK (status IN ('draft','published','cancelled')),
  start_datetime          timestamptz NOT NULL,
  end_datetime            timestamptz,
  location                text,
  cover_image_url         text,
  is_registration_required boolean DEFAULT false,
  max_attendees           integer,
  created_by              uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);
```

---

### event_registrations

```sql
CREATE TABLE public.event_registrations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended    boolean DEFAULT false,
  registered_at timestamptz DEFAULT now(),
  UNIQUE (event_id, profile_id)
);
```

---

### news

```sql
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
```

---

### gallery_albums

```sql
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
```

---

### gallery_photos

```sql
CREATE TABLE public.gallery_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id    uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  url         text NOT NULL,
  caption     text,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);
```

---

### documents

```sql
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
```

---

### notifications

```sql
CREATE TABLE public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text NOT NULL,
  message    text,
  is_read    boolean DEFAULT false,
  link       text,
  created_at timestamptz DEFAULT now()
);
```

---

### contact_messages

```sql
CREATE TABLE public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

---

### settings

```sql
CREATE TABLE public.settings (
  key        varchar PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);
```

---

## 4. Row-Level Security Policies

### General Pattern

```sql
-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (status = 'published');

-- Members can read their own profile
CREATE POLICY "Members can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins have full access
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('secretary','president','super_admin')
    )
  );
```

Full RLS policies are applied in `supabase/migrations/002_rls_policies.sql`.

---

## 5. Database Triggers

### Auto-create profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, role)
  VALUES (NEW.id, 'member');

  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 6. Indexes

```sql
-- Profiles
CREATE INDEX idx_profiles_membership_status ON public.profiles(membership_status);
CREATE INDEX idx_profiles_university ON public.profiles(university);
CREATE INDEX idx_profiles_committee_id ON public.profiles(committee_id);

-- Events
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX idx_events_slug ON public.events(slug);

-- News
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_category ON public.news(category);

-- Notifications
CREATE INDEX idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
```
