"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";
import type { UserRole } from "@/types";

export function useRole() {
  const { user, loading: userLoading } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setRole((data?.role as UserRole) ?? "member");
        setLoading(false);
      });
  }, [user, userLoading]);

  const isAdmin = role ? ["secretary", "president", "super_admin"].includes(role) : false;
  const isSuperAdmin = role === "super_admin";

  return { role, loading, isAdmin, isSuperAdmin };
}
