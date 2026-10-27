import type { SectionKey, SiteContent } from "@/services/content/types";

/**
 * Where site content lives. The UI only talks to this interface,
 * so the storage backend can change without touching components.
 */
export interface ContentRepository {
  load(): Promise<SiteContent>;
  saveSection<K extends SectionKey>(key: K, value: SiteContent[K]): Promise<void>;
}
