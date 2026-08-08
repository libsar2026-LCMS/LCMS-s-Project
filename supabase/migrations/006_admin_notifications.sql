-- ============================================================
-- Migration 006 — Admin Notification Policies
-- ============================================================
-- Run in Supabase SQL Editor after 005_member_approval_flow.sql
-- ============================================================

-- Allow admins to insert notifications for any profile
CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.get_user_role() IN ('secretary', 'president', 'super_admin'));
