import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isPreviewMode } from "@/lib/supabase/mock";

const PUBLIC_ROUTES   = ["/", "/about", "/leadership", "/committees", "/events", "/news", "/gallery", "/documents", "/contact"];
const AUTH_ROUTES     = ["/login", "/register", "/forgot-password", "/verify-email", "/confirm", "/pending-approval"];
const PASSWORD_ROUTES = ["/reset-password"];

function isMatch(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export async function middleware(request: NextRequest) {
  if (isPreviewMode()) return NextResponse.next();

  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth/")) return supabaseResponse;

  // Redirect authenticated users away from auth pages
  if (user && isMatch(pathname, AUTH_ROUTES)) {
    const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
    const role = data?.role ?? "member";
    const dest = ["secretary", "president", "super_admin"].includes(role) ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Force password change for admin-created accounts
  if (user && !isMatch(pathname, PASSWORD_ROUTES) && !isMatch(pathname, AUTH_ROUTES)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("must_change_password")
      .eq("id", user.id)
      .single();
    if (profile?.must_change_password) {
      return NextResponse.redirect(new URL("/reset-password?forced=1", request.url));
    }
  }

  if (
    !user &&
    !isMatch(pathname, PUBLIC_ROUTES) &&
    !isMatch(pathname, AUTH_ROUTES) &&
    !isMatch(pathname, PASSWORD_ROUTES)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
