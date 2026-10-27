"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getFirebase } from "@/services/config/firebase";
import { createFirestoreLikesRepository } from "@/services/likes/firestoreLikesRepository";
import type { LikesRepository } from "@/services/likes/LikesRepository";

const LikesContext = createContext<LikesRepository | null>(null);

type LikesProviderProps = {
  children: ReactNode;
  /** Injected in tests; defaults to Firestore. */
  repository?: LikesRepository;
};

export function LikesProvider({ children, repository: injected }: LikesProviderProps) {
  const [repository, setRepository] = useState<LikesRepository | null>(injected ?? null);

  useEffect(() => {
    // Firebase can only start in the browser, so the default repository is created here.
    if (injected) return;
    const firebase = getFirebase();
    setRepository(firebase ? createFirestoreLikesRepository(firebase.db) : null);
  }, [injected]);

  return <LikesContext.Provider value={repository}>{children}</LikesContext.Provider>;
}

/** null when Firebase is not configured: like buttons then stay hidden. */
export function useLikesRepository() {
  return useContext(LikesContext);
}
