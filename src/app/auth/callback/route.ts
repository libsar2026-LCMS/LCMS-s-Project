import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", data.user.id)
        .single();

      const status = profile?.membership_status ?? "pending";
      if (status === "pending") return NextResponse.redirect(`${origin}/pending-approval`);
      if (status === "rejected") return NextResponse.redirect(`${origin}/unauthorized?reason=rejected`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
