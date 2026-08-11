-- ============================================================
-- Migration 009 — Email Logs
-- LCMS — LIBSAR Community Management System
-- ============================================================
-- Stores a record of every email sent by the system.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to"       text        NOT NULL,
  subject    text        NOT NULL,
  type       text        NOT NULL,
  status     text        NOT NULL CHECK (status IN ('sent', 'failed')),
  error      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Super admins can read logs; no one can insert/update/delete via client
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can read email logs"
  ON public.email_logs FOR SELECT
  USING (public.get_user_role() = 'super_admin');

COMMENT ON TABLE public.email_logs IS 'Audit log of all emails sent by the LCMS email service.';
