import { redirect } from "next/navigation";

// Invite-based onboarding is no longer used.
// Users are created by Super Admin with a temporary password.
export default function InvitePage() {
  redirect("/login");
}
