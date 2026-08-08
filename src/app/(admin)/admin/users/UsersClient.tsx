"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import {
  ShieldCheck, UserPlus, Loader2, Check, X,
  Trash2, AlertTriangle, Users, Search, RefreshCw,
  Crown, Shield, UserCog, User, Copy,
} from "lucide-react";
import { getUsers, createUserByAdmin, updateUserRole, updateMemberStatus, deleteUser } from "@/actions/admin";
import { formatDate } from "@/lib/utils";

const ROLES = [
  { value: "member",         label: "Member"         },
  { value: "committee_head", label: "Committee Head" },
  { value: "secretary",      label: "Secretary"      },
  { value: "president",      label: "President"      },
  { value: "super_admin",    label: "Super Admin"    },
];

const STATUSES = ["active", "inactive", "suspended", "alumni", "pending"];

const ROLE_STYLES: Record<string, string> = {
  super_admin:    "bg-accent/10 text-accent border border-accent/20",
  president:      "bg-primary/10 text-primary border border-primary/20",
  secretary:      "bg-blue-50 text-blue-700 border border-blue-200",
  committee_head: "bg-purple-50 text-purple-700 border border-purple-200",
  member:         "bg-border text-text-secondary border border-border",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  super_admin:    <Crown size={10} />,
  president:      <Shield size={10} />,
  secretary:      <ShieldCheck size={10} />,
  committee_head: <UserCog size={10} />,
  member:         <User size={10} />,
};

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-success/10 text-success border border-success/20",
  pending:   "bg-warning/10 text-warning border border-warning/20",
  inactive:  "bg-border text-text-secondary border border-border",
  suspended: "bg-accent/10 text-accent border border-accent/20",
  alumni:    "bg-blue-50 text-blue-700 border border-blue-200",
};

type UserRow = {
  id: string;
  role: string;
  created_at: string;
  email: string | null;
  full_name: string | null;
  membership_status: string | null;
};

type ToastState = { type: "success" | "error"; text: string };
type Credentials = { email: string; tempPassword: string };

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

function StatPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 ${color}`}>
      <span className="text-2xl font-extrabold tracking-tight">{count}</span>
      <span className="text-xs font-medium leading-tight opacity-80">{label}</span>
    </div>
  );
}

function CredentialsModal({ credentials, onClose }: { credentials: Credentials; onClose: () => void }) {
  const [copied, setCopied] = useState<"email" | "pass" | null>(null);

  function copy(text: string, field: "email" | "pass") {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-success/10">
          <Check size={20} className="text-success" />
        </div>
        <h3 className="font-semibold text-text-primary">User created successfully</h3>
        <p className="mt-1.5 text-sm text-text-secondary">
          Share these credentials with the user. They sign in at{" "}
          <strong className="text-text-primary">/login</strong> and can reset their password anytime via{" "}
          <strong className="text-text-primary">Forgot Password</strong>.
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="mb-1 text-xs font-medium text-text-secondary">Email</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono text-text-primary">{credentials.email}</code>
              <button
                onClick={() => copy(credentials.email, "email")}
                className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:border-primary/30 hover:text-primary"
              >
                {copied === "email" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="mb-1 text-xs font-medium text-primary">Temporary Password</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono font-bold text-primary">{credentials.tempPassword}</code>
              <button
                onClick={() => copy(credentials.tempPassword, "pass")}
                className="shrink-0 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                {copied === "pass" ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-xs text-warning">
          ⚠️ This password will not be shown again. Copy it before closing.
        </div>

        <div className="mt-3 rounded-xl border border-border bg-background px-4 py-3 text-xs text-text-secondary space-y-1">
          <p className="font-medium text-text-primary">How the user signs in:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Go to <strong>/login</strong> and enter their email + temp password</li>
            <li>Once signed in, go to <strong>Profile → Change Password</strong> to set a new one</li>
            <li>Or use <strong>Forgot Password</strong> on the login page to reset via email</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-light"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export function UsersClient() {
  const [users, setUsers]                 = useState<UserRow[]>([]);
  const [filtered, setFiltered]           = useState<UserRow[]>([]);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState<ToastState | null>(null);
  const [addPending, startAdd]            = useTransition();
  const [savingId, setSavingId]           = useState<string | null>(null);
  const [addForm, setAddForm]             = useState({ full_name: "", email: "", role: "member", phone: "" });
  const [credentials, setCredentials]     = useState<Credentials | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [roleFilter, setRoleFilter]       = useState("");

  function notify(type: "success" | "error", text: string) {
    setToast({ type, text });
  }

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getUsers();
    if (result.data) setUsers(result.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);



  useEffect(() => {
    let list = users;
    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [users, search, roleFilter]);

  const adminCount   = users.filter((u) => ["secretary", "president", "super_admin"].includes(u.role)).length;
  const pendingCount = users.filter((u) => u.membership_status === "pending").length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startAdd(async () => {
      const result = await createUserByAdmin(
        addForm.email,
        addForm.full_name,
        addForm.role,
        { phone: addForm.phone || undefined },
      );
      if (result?.error) {
        notify("error", result.error);
      } else if (result?.tempPassword && result?.email) {
        setCredentials({ email: result.email, tempPassword: result.tempPassword });
        setAddForm({ full_name: "", email: "", role: "member", phone: "" });
        load();
      }
    });
  }

  async function handleRoleChange(userId: string, role: string) {
    setSavingId(userId + "-role");
    const result = await updateUserRole(userId, role);
    setSavingId(null);
    if (result?.error) notify("error", result.error);
    else { notify("success", "Role updated."); load(); }
  }

  async function handleStatusChange(userId: string, status: string) {
    setSavingId(userId + "-status");
    const result = await updateMemberStatus(userId, status);
    setSavingId(null);
    if (result?.error) notify("error", result.error);
    else { notify("success", "Status updated."); load(); }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    setConfirmDelete(null);
    const result = await deleteUser(confirmDelete.id);
    setDeletingId(null);
    if (result?.error) notify("error", result.error);
    else { notify("success", "User deleted successfully."); load(); }
  }

  return (
    <div className="space-y-7">
      {toast && <ToastBanner toast={toast} onDismiss={() => setToast(null)} />}
      {credentials && <CredentialsModal credentials={credentials} onClose={() => setCredentials(null)} />}

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
              <AlertTriangle size={20} className="text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">Delete user?</h3>
            <p className="mt-1.5 text-sm text-text-secondary">
              <strong className="text-text-primary">{confirmDelete.full_name ?? confirmDelete.email}</strong> will be permanently removed including all their data. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-border/60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition hover:bg-accent-light"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Users & Roles</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage system access, roles, and membership status. Super Admin only.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Total Users"      count={users.length}   color="border-primary/20 bg-primary/5 text-primary" />
        <StatPill label="Admins"           count={adminCount}     color="border-accent/20 bg-accent/5 text-accent" />
        <StatPill label="Pending Approval" count={pendingCount}   color="border-warning/30 bg-warning/8 text-warning" />
        <StatPill label="Showing"          count={filtered.length} color="border-border bg-background text-text-secondary" />
      </div>

      {/* Context callouts */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-0.5">Users (this page)</p>
          <p className="text-xs text-text-secondary">Controls <strong className="text-text-primary">system access & role</strong> — who can log in and what admin permissions they have.</p>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-0.5">Members (Members page)</p>
          <p className="text-xs text-text-secondary">Controls <strong className="text-text-primary">community membership</strong> — profile info, membership ID, university, and membership status.</p>
        </div>
      </div>

      {/* Add User form */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-text-primary">
          <UserPlus size={16} className="text-primary" /> Add New User
        </h2>
        <p className="mb-4 text-xs text-text-secondary">
          Creates an account instantly with a temporary password. Share the credentials — the user signs in and must set a new password before accessing the system.
        </p>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]  sm:items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Full Name <span className="text-accent">*</span></label>
              <input
                required
                placeholder="e.g. John Doe"
                value={addForm.full_name}
                onChange={(e) => setAddForm((f) => ({ ...f, full_name: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Email <span className="text-accent">*</span></label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Phone</label>
              <input
                type="tel"
                placeholder="+250 000 000 000"
                value={addForm.phone}
                onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Role <span className="text-accent">*</span></label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addPending}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-light disabled:opacity-60"
            >
              {addPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
              <Users size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary leading-none">All Users</h2>
              <p className="mt-0.5 text-xs text-text-secondary">
                {loading ? "Loading…" : `${users.length} total · ${filtered.length} shown`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-52 sm:flex-none">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email…"
                className="w-full rounded-xl border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">All roles</option>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Role</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:table-cell">Membership Status</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary md:table-cell">Joined</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Loader2 size={24} className="mx-auto animate-spin text-border" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-text-secondary">
                    <ShieldCheck size={32} className="mx-auto mb-3 text-border" />
                    {search || roleFilter ? "No users match your filters." : "No users found."}
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary ring-2 ring-primary/10">
                        {(u.full_name ?? u.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-text-primary">{u.full_name ?? "—"}</p>
                        <p className="truncate text-xs text-text-secondary">{u.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={u.role}
                        disabled={savingId === u.id + "-role"}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none transition focus:border-primary disabled:opacity-50"
                      >
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      {savingId === u.id + "-role"
                        ? <Loader2 size={12} className="animate-spin text-primary" />
                        : <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_STYLES[u.role] ?? ROLE_STYLES.member}`}>
                            {ROLE_ICONS[u.role]}
                            {u.role.replace(/_/g, " ")}
                          </span>
                      }
                    </div>
                  </td>

                  <td className="hidden px-5 py-4 sm:table-cell">
                    {u.membership_status ? (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={u.membership_status}
                          disabled={savingId === u.id + "-status"}
                          onChange={(e) => handleStatusChange(u.id, e.target.value)}
                          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none transition focus:border-primary disabled:opacity-50"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        {savingId === u.id + "-status"
                          ? <Loader2 size={12} className="animate-spin text-primary" />
                          : <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[u.membership_status] ?? STATUS_STYLES.active}`}>
                              {u.membership_status}
                            </span>
                        }
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary">—</span>
                    )}
                  </td>

                  <td className="hidden px-5 py-4 text-xs text-text-secondary md:table-cell">{formatDate(u.created_at)}</td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setConfirmDelete(u)}
                      disabled={deletingId === u.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white hover:border-accent disabled:opacity-40"
                    >
                      {deletingId === u.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length > 0 && (
          <div className="border-t border-border bg-background/50 px-5 py-3">
            <p className="text-xs text-text-secondary">
              Showing <strong className="text-text-primary">{filtered.length}</strong> of <strong className="text-text-primary">{users.length}</strong> users
              {roleFilter && <> · filtered by <strong className="text-text-primary">{roleFilter.replace(/_/g, " ")}</strong></>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
