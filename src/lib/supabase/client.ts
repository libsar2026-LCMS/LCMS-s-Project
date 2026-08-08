import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isPreviewMode, createMockClient } from "./mock";

function buildBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type SupabaseBrowserClient = ReturnType<typeof buildBrowserClient>;

export function createClient(): SupabaseBrowserClient {
  if (isPreviewMode()) return createMockClient() as unknown as SupabaseBrowserClient;
  return buildBrowserClient();
}
