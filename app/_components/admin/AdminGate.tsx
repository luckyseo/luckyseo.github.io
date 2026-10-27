"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/_components/core/Button";
import type { AuthService } from "@/services/auth/auth";
import { useAdminStatus } from "@/services/auth/useAdminStatus";

type AdminGateProps = {
  /** null when Firebase is not configured. */
  authService: AuthService | null;
  children: ReactNode;
};

function GateMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="admin-gate">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

/** Shows children only to the admin. UI only: Firestore rules enforce the real permission. */
export function AdminGate({ authService, children }: AdminGateProps) {
  const { status, user } = useAdminStatus(authService);

  if (!authService) {
    return (
      <GateMessage title="Firebase is not configured">
        <p>Add the NEXT_PUBLIC_FIREBASE_* values to .env.local (see .env.example) and restart the dev server.</p>
      </GateMessage>
    );
  }

  if (status === "loading") return <GateMessage title="Checking access…" />;

  if (status === "signed-out") {
    return (
      <GateMessage title="Admin">
        <Button type="button" onClick={() => void authService.signIn().catch(() => undefined)}>
          Sign in with Google
        </Button>
      </GateMessage>
    );
  }

  if (status === "not-admin") {
    return (
      <GateMessage title="Not authorised">
        <p>{user?.email} can view the site but cannot edit it.</p>
        <Button type="button" variant="outline" onClick={() => void authService.signOut()}>
          Sign out
        </Button>
      </GateMessage>
    );
  }

  return (
    <>
      <div className="admin-bar">
        <span>Signed in as {user?.email}</span>
        <Button variant="link" href="/">
          View site
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => void authService.signOut()}>
          Sign out
        </Button>
      </div>
      {children}
    </>
  );
}
