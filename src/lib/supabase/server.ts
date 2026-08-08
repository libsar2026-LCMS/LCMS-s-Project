import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { isPreviewMode, createMockClient } from "./mock";

function buildServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies can't be set, middleware handles refresh
          }
        },
      },
    }
  );
}

export type SupabaseServerClient = ReturnType<typeof buildServerClient>;

export async function createClient(): Promise<SupabaseServerClient> {
  if (isPreviewMode()) return createMockClient() as unknown as SupabaseServerClient;
  const cookieStore = await cookies();
  return buildServerClient(cookieStore);
}
