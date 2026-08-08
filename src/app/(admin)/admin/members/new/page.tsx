"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserByAdmin } from "@/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, UserPlus, Copy, Check, KeyRound } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { value: "member",         label: "Member"         },
  { value: "committee_head", label: "Committee Head" },
  { value: "secretary",      label: "Secretary"      },
  { value: "president",      label: "President"      },
  { value: "super_admin",    label: "Super Admin"    },
];

type Committee = { id: string; name: string };

export default function NewMemberPage() {
  const router = useRouter();
  const [pending, setPending]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [created, setCreated]   = useState<{ email: string; tempPassword: string } | null>(null);
  const [copied, setCopied]     = useState(false);
  const [committees, setCommittees] = useState<Committee[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("committees").select("id, name").eq("is_active", true).order("name")
      .then(({ data }) => setCommittees(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const result = await createUserByAdmin(
      fd.get("email") as string,
      fd.get("full_name") as string,
      fd.get("role") as string,
      {
        phone:       (fd.get("phone") as string)        || undefined,
        university:  (fd.get("university") as string)   || undefined,
        committeeId: (fd.get("committee_id") as string) || undefined,
      },
    );

    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else if (result?.tempPassword && result?.email) {
      setCreated({ email: result.email, tempPassword: result.tempPassword });
    }
  }

  function copyPassword() {
    navigator.clipboard.writeText(created!.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  if (created) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-success/30 bg-success/5 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15">
              <KeyRound size={18} className="text-success" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary">Account Created!</h2>
              <p className="text-sm text-text-secondary">Share these credentials with the member</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-background p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Email</span>
              <span className="font-medium text-text-primary">{created.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Temp Password</span>
              <div className="flex items-center gap-2">
                <code className="rounded-lg bg-surface px-3 py-1 font-mono font-semibold text-text-primary">
                  {created.tempPassword}
                </code>
                <button
                  onClick={copyPassword}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:border-primary/40 hover:text-primary"
                >
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-secondary">
            The member signs in at <span className="font-medium text-primary">/login</span> and will be prompted to set a new password immediately.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => { setCreated(null); setError(null); }}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push("/admin/members")}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-light"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Add Member</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Create an account and share credentials with the member</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Required fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Full Name <span className="text-accent">*</span>
              </label>
              <input name="full_name" required placeholder="e.g. John Doe" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Email Address <span className="text-accent">*</span>
              </label>
              <input name="email" type="email" required placeholder="e.g. john@example.com" className={inputCls} />
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Phone <span className="text-xs font-normal text-text-secondary">(optional)</span>
              </label>
              <input name="phone" type="tel" placeholder="+250 000 000 000" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                University <span className="text-xs font-normal text-text-secondary">(optional)</span>
              </label>
              <input name="university" placeholder="e.g. University of Rwanda" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Role <span className="text-accent">*</span>
              </label>
              <select name="role" defaultValue="member" className={inputCls}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Committee <span className="text-xs font-normal text-text-secondary">(optional)</span>
              </label>
              <select name="committee_id" defaultValue="" className={inputCls}>
                <option value="">No committee</option>
                {committees.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
          >
            <UserPlus size={15} />
            {pending ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
