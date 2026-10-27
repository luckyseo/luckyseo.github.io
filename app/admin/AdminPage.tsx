"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "@/app/_components/admin/AdminGate";
import { AdminDashboard } from "@/app/admin/AdminDashboard";
import { createFirebaseAuthService, type AuthService } from "@/services/auth/auth";
import { getFirebase } from "@/services/config/firebase";

export function AdminPage() {
  const [authService, setAuthService] = useState<AuthService | null>(null);
  const [ready, setReady] = useState(false);

  // Firebase only runs in the browser, so it is created after the first render.
  useEffect(() => {
    const firebase = getFirebase();
    setAuthService(firebase ? createFirebaseAuthService(firebase) : null);
    setReady(true);
  }, []);

  return (
    <main className="container admin-page">
      {ready ? (
        <AdminGate authService={authService}>
          <AdminDashboard />
        </AdminGate>
      ) : null}
    </main>
  );
}
