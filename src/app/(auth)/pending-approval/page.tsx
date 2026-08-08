import { Clock } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account Pending Approval" };

export default function PendingApprovalPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
        <Clock size={40} className="text-warning" />
      </div>
      <h1 className="font-display text-2xl font-bold text-text-primary">Account Pending Approval</h1>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
        Your account has been created successfully. The administrator will review and approve your account shortly.
        You will receive an email notification once your account is approved.
      </p>
      <form
        action={async () => {
          "use server";
          await logout();
        }}
        className="mt-8"
      >
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
