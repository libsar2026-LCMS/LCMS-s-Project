export type UserRole =
  | "visitor"
  | "member"
  | "committee_head"
  | "secretary"
  | "president"
  | "super_admin";

export type MembershipStatus = "active" | "inactive" | "suspended" | "alumni";

export type AcademicLevel = "undergraduate" | "postgraduate" | "phd" | "alumni";

export type EventType = "meeting" | "sports" | "cultural" | "community_service" | "social" | "other";

export type EventStatus = "draft" | "published" | "cancelled";

export type NewsCategory =
  | "announcement"
  | "scholarship"
  | "community"
  | "graduation"
  | "achievement";

export type NewsStatus = "draft" | "published";

export type DocumentCategory =
  | "constitution"
  | "report"
  | "minutes"
  | "form"
  | "certificate"
  | "strategic_plan"
  | "other";
