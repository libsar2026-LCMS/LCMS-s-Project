-- ============================================================
-- Migration 007 — Add Rwanda address fields to profiles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS rwanda_province text,
  ADD COLUMN IF NOT EXISTS rwanda_district text,
  ADD COLUMN IF NOT EXISTS rwanda_sector   text;
