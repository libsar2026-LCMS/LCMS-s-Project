// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UsersRound, User, UserPlus, X } from "lucide-react";
import type { Metadata } from "next";
import { assignMemberToCommittee } from "@/actions/admin";

export const metadata: Metadata = { title: "Edit Committee — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCommitteePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: committee }, { data: allActive }, { data: members }] = await Promise.all([
    supabase
      .from("committees")
      .select("*, profiles:head_id(full_name)")
      .eq("id", id)
      .single(),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("membership_status", "active")
      .order("full_name"),
    supabase
      .from("profiles")
      .select("id, full_name, profile_photo_url, academic_level")
      .eq("committee_id", id)
      .order("full_name"),
  ]);

  if (!committee) notFound();

  const memberIds = new Set((members ?? []).map((m) => m.id));
  const unassigned = (allActive ?? []).filter((p) => !memberIds.has(p.id));

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/committees"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Edit Committee</h1>
          <p className="mt-0.5 text-sm text-text-secondary truncate max-w-xs">{committee.name}</p>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${committee.is_active ? "bg-success/10 text-success" : "bg-border text-text-secondary"}`}>
          {committee.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-text-secondary">Committee Details</h2>
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            await supabase.from("committees").update({
              name:        fd.get("name") as string,
              description: (fd.get("description") as string) || null,
              head_id:     (fd.get("head_id") as string) || null,
              is_active:   fd.get("is_active") === "true",
            }).eq("id", id);
            redirect("/admin/committees");
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Name <span className="text-accent">*</span></label>
            <input
              name="name"
              required
              defaultValue={committee.name}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={committee.description ?? ""}
              placeholder="What does this committee do?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Committee Head</label>
              <select name="head_id" defaultValue={committee.head_id ?? ""} className={inputCls}>
                <option value="">— None —</option>
                {(allActive ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select name="is_active" defaultValue={String(committee.is_active)} className={inputCls}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/committees"
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
            >
              <UsersRound size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Members in this committee */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Members</h2>
          <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {(members ?? []).length}
          </span>
        </div>

        {/* Assign member */}
        {unassigned.length > 0 && (
          <form
            action={async (fd: FormData) => {
              "use server";
              const profileId = fd.get("profile_id") as string;
              if (profileId) await assignMemberToCommittee(profileId, id);
              redirect(`/admin/committees/${id}`);
            }}
            className="mb-5 flex gap-2"
          >
            <select
              name="profile_id"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">Select member to assign…</option>
              {unassigned.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary-light"
            >
              <UserPlus size={14} /> Assign
            </button>
          </form>
        )}

        {(members ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <User size={28} className="mb-2 text-border" />
            <p className="text-sm text-text-secondary">No members assigned to this committee yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {(members ?? []).map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/8">
                  {m.profile_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.profile_photo_url} alt={m.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={13} className="text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{m.full_name}</p>
                  {m.academic_level && (
                    <p className="text-xs capitalize text-text-secondary">{m.academic_level}</p>
                  )}
                </div>
                <Link
                  href={`/admin/members/${m.id}`}
                  className="shrink-0 text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  View →
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await assignMemberToCommittee(m.id, null);
                    redirect(`/admin/committees/${id}`);
                  }}
                >
                  <button
                    type="submit"
                    title="Remove from committee"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition hover:bg-accent/10 hover:text-accent"
                  >
                    <X size={13} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
        <h2 className="mb-1 text-sm font-semibold text-accent">Danger Zone</h2>
        <p className="mb-4 text-xs text-text-secondary">Deleting a committee is permanent and cannot be undone.</p>
        <form
          action={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.from("committees").delete().eq("id", id);
            redirect("/admin/committees");
          }}
        >
          <button
            type="submit"
            className="rounded-xl border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
          >
            Delete Committee
          </button>
        </form>
      </div>
    </div>
  );
}
