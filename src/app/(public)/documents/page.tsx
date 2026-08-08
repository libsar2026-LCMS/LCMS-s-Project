import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText, Download, File } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Documents" };

type Document = Database["public"]["Tables"]["documents"]["Row"];

const CATEGORY_STYLES: Record<string, string> = {
  constitution:  "bg-blue-50   text-blue-700   border-blue-100",
  minutes:       "bg-green-50  text-green-700  border-green-100",
  report:        "bg-purple-50 text-purple-700 border-purple-100",
  form:          "bg-yellow-50 text-yellow-700 border-yellow-100",
  other:         "bg-gray-50   text-gray-700   border-gray-100",
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const documents = (data as Document[] | null) ?? [];

  const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    const cat = doc.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Access official LIBSAR documents, reports, forms, and resources."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {documents.length === 0 ? (
          <EmptyState icon={FileText} title="No documents available" description="Public documents will appear here." />
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, docs]) => (
              <section key={category}>
                <h2 className="mb-5 text-lg font-bold text-text-primary capitalize">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {docs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/15">
                        <File size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors text-sm leading-snug">
                          {doc.title}
                        </p>
                        {doc.description && (
                          <p className="mt-1 text-xs text-text-secondary line-clamp-1">{doc.description}</p>
                        )}
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${CATEGORY_STYLES[doc.category] ?? CATEGORY_STYLES.other}`}>
                            {doc.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <Download size={11} />
                            {formatFileSize(doc.file_size)}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
