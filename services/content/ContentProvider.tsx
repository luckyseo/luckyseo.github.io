"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getFirebase } from "@/services/config/firebase";
import type { ContentRepository } from "@/services/content/ContentRepository";
import { EMPTY_CONTENT } from "@/services/content/defaults";
import { createFirestoreRepository } from "@/services/content/firestoreRepository";
import type { SectionKey, SiteContent } from "@/services/content/types";

export type ContentStatus = "loading" | "ready" | "unconfigured" | "error";

type SaveSection = <K extends SectionKey>(key: K, value: SiteContent[K]) => Promise<void>;

type ContentContextValue = {
  content: SiteContent;
  status: ContentStatus;
  saveSection: SaveSection;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function defaultRepository(): ContentRepository | null {
  const firebase = getFirebase();
  return firebase ? createFirestoreRepository(firebase.db) : null;
}

type ContentProviderProps = {
  children: ReactNode;
  /** Injected in tests; defaults to Firestore. */
  repository?: ContentRepository;
};

export function ContentProvider({ children, repository: injected }: ContentProviderProps) {
  const [repository, setRepository] = useState<ContentRepository | null>(injected ?? null);
  const [content, setContent] = useState<SiteContent>(EMPTY_CONTENT);
  const [status, setStatus] = useState<ContentStatus>("loading");

  useEffect(() => {
    // Firebase can only start in the browser, so the default repository is created here.
    const repo = injected ?? defaultRepository();
    setRepository(repo);

    if (!repo) {
      setStatus("unconfigured");
      return;
    }

    let alive = true;
    repo
      .load()
      .then((loaded) => {
        if (!alive) return;
        setContent(loaded);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Could not load content", error);
        if (alive) setStatus("error");
      });

    return () => {
      alive = false;
    };
  }, [injected]);

  const saveSection = useCallback<SaveSection>(
    async (key, value) => {
      if (!repository) throw new Error("Content storage is not configured.");
      await repository.saveSection(key, value);
      setContent((current) => ({ ...current, [key]: value }));
    },
    [repository],
  );

  const value = useMemo(() => ({ content, status, saveSection }), [content, status, saveSection]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used inside <ContentProvider>");
  return context;
}

/** Read-only access for public sections. */
export function useContent() {
  const { content, status } = useContentContext();
  return { ...content, status };
}

/** Write access, used by the admin editors. */
export function useSaveSection() {
  return useContentContext().saveSection;
}
