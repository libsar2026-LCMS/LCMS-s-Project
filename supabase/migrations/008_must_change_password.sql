-- ============================================================
-- Migration 008 — Must Change Password Flag
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Tracks whether an admin-created user must change their
-- temporary password before accessing the system.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

-- Update the trigger so admin-created users (detected by
-- raw_app_meta_data->>'provider' = 'email' AND no invited_by,
-- but we use a custom flag set via user_metadata instead)
-- keep must_change_password = false by default.
-- The application sets it to true explicitly after admin creation.

COMMENT ON COLUMN public.profiles.must_change_password IS
  'When true, user is redirected to /reset-password on next login. Set for admin-created accounts.';
