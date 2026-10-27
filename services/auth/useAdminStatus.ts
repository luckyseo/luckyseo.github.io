"use client";

import { useEffect, useState } from "react";
import type { AuthService, AuthUser } from "@/services/auth/auth";

export type AdminStatus = "loading" | "signed-out" | "not-admin" | "admin";

/**
 * Tracks whether the signed-in user is the admin.
 * This only decides what the UI shows; Firestore rules are what actually block writes.
 */
export function useAdminStatus(authService: AuthService | null) {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!authService) return;

    let alive = true;

    const unsubscribe = authService.onAuthChange(async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setStatus("signed-out");
        return;
      }

      setStatus("loading");
      const admin = await authService.isAdmin(nextUser.uid).catch(() => false);
      if (alive) setStatus(admin ? "admin" : "not-admin");
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, [authService]);

  return { status, user };
}
