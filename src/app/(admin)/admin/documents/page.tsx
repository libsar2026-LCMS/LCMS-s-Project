// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Download } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Documents — Admin" };

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: docs, count } = await supabase
    .from("documents")
    .select("id, title, category, file_url, file_size, is_public, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Documents</h1>
          <p className="mt-1 text-sm text-text-secondary">{count ?? 0} documents</p>
        </div>
        <Link
          href="/admin/documents/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> Upload Document
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Document</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:table-cell">Category</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary md:table-cell">Size</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary lg:table-cell">Uploaded</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Visibility</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(docs ?? []).map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                        <FileText size={15} className="text-primary" />
                      </div>
                      <p className="font-medium text-text-primary line-clamp-1">{d.title}</p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <span className="rounded-full bg-border px-2.5 py-0.5 text-xs font-medium capitalize text-text-secondary">
                      {d.category}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-text-secondary md:table-cell">{formatSize(d.file_size)}</td>
                  <td className="hidden px-5 py-4 text-text-secondary lg:table-cell">{formatDate(d.created_at)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.is_public ? "bg-success/10 text-success" : "bg-border text-text-secondary"}`}>
                      {d.is_public ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors">
                      <Download size={12} /> Download
                    </a>
                  </td>
                </tr>
              ))}
              {(docs ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-text-secondary">
                    <FileText size={32} className="mx-auto mb-3 text-border" />
                    No documents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

