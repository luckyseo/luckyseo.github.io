import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthService, AuthUser } from "@/services/auth/auth";
import { useAdminStatus } from "@/services/auth/useAdminStatus";

/** Auth service whose signed-in user the test controls. */
function fakeAuth(adminUids: string[]) {
  let listener: (user: AuthUser | null) => void = () => undefined;

  const service: AuthService = {
    onAuthChange: (next) => {
      listener = next;
      return vi.fn();
    },
    isAdmin: async (uid) => adminUids.includes(uid),
    signIn: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
  };

  return { service, emit: (user: AuthUser | null) => act(() => listener(user)) };
}

describe("useAdminStatus", () => {
  it("starts loading, then reports signed-out", async () => {
    const auth = fakeAuth([]);
    const { result } = renderHook(() => useAdminStatus(auth.service));

    expect(result.current.status).toBe("loading");
    await auth.emit(null);
    expect(result.current.status).toBe("signed-out");
  });

  it("recognises the admin", async () => {
    const auth = fakeAuth(["admin-uid"]);
    const { result } = renderHook(() => useAdminStatus(auth.service));

    await auth.emit({ uid: "admin-uid", email: "admin@example.com" });
    await waitFor(() => expect(result.current.status).toBe("admin"));
  });

  it("treats any other account as not-admin", async () => {
    const auth = fakeAuth(["admin-uid"]);
    const { result } = renderHook(() => useAdminStatus(auth.service));

    await auth.emit({ uid: "someone-else", email: "x@example.com" });
    await waitFor(() => expect(result.current.status).toBe("not-admin"));
  });

  it("treats a failed admin check as not-admin", async () => {
    const auth = fakeAuth([]);
    auth.service.isAdmin = async () => Promise.reject(new Error("permission-denied"));
    const { result } = renderHook(() => useAdminStatus(auth.service));

    await auth.emit({ uid: "u", email: null });
    await waitFor(() => expect(result.current.status).toBe("not-admin"));
  });
});
