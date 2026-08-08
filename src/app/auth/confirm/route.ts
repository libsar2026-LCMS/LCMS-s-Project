import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const error = searchParams.get("error");
  if (error) {
    const desc = searchParams.get("error_description") ?? "Link is invalid or has expired.";
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(desc)}`);
  }

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Link is invalid or has expired.")}`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
