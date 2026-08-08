-- ============================================================
-- Migration 005 — Member Approval Flow
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Run this in Supabase SQL Editor after 004_bootstrap_super_admin.sql
-- ============================================================

-- Add 'pending' to membership_status allowed values
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_membership_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_membership_status_check
  CHECK (membership_status IN ('pending','active','inactive','suspended','alumni'));

-- Update default to 'pending' for new self-registered members
ALTER TABLE public.profiles
  ALTER COLUMN membership_status SET DEFAULT 'pending';

-- Update the trigger so invited users (email confirmed via invite)
-- get 'active' status, while self-registered users get 'pending'.
-- We detect invite vs self-register by checking raw_user_meta_data->>'invited_by'
-- which Supabase sets automatically on invited users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  initial_status text;
BEGIN
  -- Invited users (via admin invite) start as active; self-registered start as pending
  -- Supabase sets invited_by in raw_app_meta_data, not raw_user_meta_data
  IF NEW.raw_app_meta_data->>'invited_by' IS NOT NULL THEN
    initial_status := 'active';
  ELSE
    initial_status := 'pending';
  END IF;

  INSERT INTO public.users (id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, full_name, date_joined, membership_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CURRENT_DATE,
    initial_status
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
