"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { Users, Search, UserPlus, Loader2, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { approveMember } from "@/actions/admin";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-success/10 text-success",
  pending:   "bg-warning/10 text-warning",
  inactive:  "bg-border text-text-secondary",
  suspended: "bg-accent/10 text-accent",
  alumni:    "bg-blue-50 text-blue-700",
};

type Member = {
  id: string;
  full_name: string;
  membership_id: string | null;
  membership_status: string;
  university: string | null;
  date_joined: string | null;
  created_at: string;
};

type ToastState = { type: "success" | "error"; text: string };

function ToastBanner({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-xl ${
      toast.type === "success" ? "bg-success text-white" : "bg-accent text-white"
    }`}>
      {toast.type === "success" ? <Check size={15} /> : <X size={15} />}
      {toast.text}
    </div>
  );
}

export function MembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const load = useCallback(async (search: string, statusFilter: string, currentPage: number) => {
    setLoading(true);
    const supabase = createClient();
    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("profiles")
      .select("id, full_name, membership_id, membership_status, university, date_joined, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) query = query.ilike("full_name", `%${search}%`);
    if (statusFilter) query = query.eq("membership_status", statusFilter);

    const { data, count } = await query;
    setMembers(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(q, status, page); }, [load, q, status, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(q, status, 1);
  }

  function handleApprove(memberId: string) {
    setApprovingId(memberId);
    startTransition(async () => {
      const result = await approveMember(memberId);
      setApprovingId(null);
      if (result?.error) {
        setToast({ type: "error", text: result.error });
      } else {
        setToast({ type: "success", text: "Member approved successfully." });
        load(q, status, page);
      }
    });
  }

  return (
    <div className="space-y-6">
      {toast && <ToastBanner toast={toast} onDismiss={() => setToast(null)} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Members</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {loading ? "Loading…" : `${total} total member${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <UserPlus size={15} /> Add Member
        </Link>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="alumni">Alumni</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Member</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">ID</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:table-cell">University</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary md:table-cell">Joined</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2 size={24} className="mx-auto animate-spin text-border" />
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-text-secondary">
                    <Users size={32} className="mx-auto mb-3 text-border" />
                    No members found.
                  </td>
                </tr>
              ) : members.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary">
                        {m.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-text-primary">{m.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-text-secondary">{m.membership_id ?? "—"}</td>
                  <td className="hidden px-5 py-4 text-text-secondary sm:table-cell">{m.university ?? "—"}</td>
                  <td className="hidden px-5 py-4 text-text-secondary md:table-cell">
                    {m.date_joined ? formatDate(m.date_joined) : formatDate(m.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[m.membership_status] ?? STATUS_STYLES.active}`}>
                      {m.membership_status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {m.membership_status === "pending" && (
                        <button
                          onClick={() => handleApprove(m.id)}
                          disabled={approvingId === m.id}
                          className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1 text-xs font-semibold text-success transition hover:bg-success/20 disabled:opacity-60"
                        >
                          {approvingId === m.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                          Approve
                        </button>
                      )}                      <Link
                        href={`/admin/members/${m.id}`}
                        className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
            <p className="text-xs text-text-secondary">
              Page {page} of {totalPages} · {total} members
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
