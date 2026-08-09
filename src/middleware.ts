import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isPreviewMode } from "@/lib/supabase/mock";

const PUBLIC_ROUTES   = ["/", "/about", "/leadership", "/committees", "/events", "/news", "/gallery", "/documents", "/contact"];
const AUTH_ROUTES     = ["/login", "/register", "/forgot-password", "/verify-email", "/confirm"];
const PENDING_ROUTE   = "/pending-approval";
const PASSWORD_ROUTES = ["/reset-password"];

function isMatch(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export async function middleware(request: NextRequest) {
  if (isPreviewMode()) return NextResponse.next();

  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth/")) return supabaseResponse;

  if (user) {
    // Fetch profile status + role in one pass
    const [{ data: profile }, { data: userRow }] = await Promise.all([
      supabase.from("profiles").select("membership_status, must_change_password").eq("id", user.id).single(),
      supabase.from("users").select("role").eq("id", user.id).single(),
    ]);

    const status = profile?.membership_status ?? "pending";
    const role   = userRow?.role ?? "member";
    const isAdmin = ["secretary", "president", "super_admin"].includes(role);

    // Pending users: allow public routes + pending-approval only
    if (status === "pending") {
      if (pathname !== PENDING_ROUTE && !isMatch(pathname, PUBLIC_ROUTES)) {
        return NextResponse.redirect(new URL(PENDING_ROUTE, request.url));
      }
      return supabaseResponse;
    }

    // Rejected users: only allow /unauthorized and auth routes
    if (status === "rejected") {
      if (pathname !== "/unauthorized" && !isMatch(pathname, AUTH_ROUTES)) {
        return NextResponse.redirect(new URL("/unauthorized?reason=rejected", request.url));
      }
      return supabaseResponse;
    }

    // Active users: force password change if required
    if (profile?.must_change_password && !isMatch(pathname, PASSWORD_ROUTES)) {
      return NextResponse.redirect(new URL("/reset-password?forced=1", request.url));
    }

    // Active users: redirect away from auth/pending pages
    if (isMatch(pathname, AUTH_ROUTES) || pathname === PENDING_ROUTE) {
      const dest = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Unauthenticated: block protected routes
  if (
    !user &&
    !isMatch(pathname, PUBLIC_ROUTES) &&
    !isMatch(pathname, AUTH_ROUTES) &&
    !isMatch(pathname, PASSWORD_ROUTES) &&
    pathname !== PENDING_ROUTE &&
    pathname !== "/unauthorized"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
