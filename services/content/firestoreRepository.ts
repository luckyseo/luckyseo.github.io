import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";
import type { ContentRepository } from "@/services/content/ContentRepository";
import { EMPTY_CONTENT } from "@/services/content/defaults";
import type { SectionKey, SiteContent } from "@/services/content/types";
import { sectionSchemas } from "@/services/content/validation";

/*
 * Firestore layout:
 *   content/profile    -> the Profile object itself
 *   content/education  -> { items: EducationItem[] }
 *   content/projects   -> { items: Project[] }
 *   content/posts      -> { items: Post[] }
 */

export const CONTENT_COLLECTION = "content";
const SECTION_KEYS: SectionKey[] = ["profile", "education", "projects", "posts"];

type StoredDoc = Record<string, unknown>;

export function toStoredDoc<K extends SectionKey>(key: K, value: SiteContent[K]): StoredDoc {
  return key === "profile" ? { ...(value as SiteContent["profile"]) } : { items: value };
}

/** Converts a stored document back into section data, falling back to empty data if it is missing or invalid. */
export function fromStoredDoc<K extends SectionKey>(key: K, stored: StoredDoc | undefined): SiteContent[K] {
  if (!stored) return EMPTY_CONTENT[key];

  const raw = key === "profile" ? stored : stored.items;
  const parsed = sectionSchemas[key].safeParse(raw);

  if (!parsed.success) {
    console.warn(`Ignoring invalid "${key}" content from Firestore`, parsed.error.issues);
    return EMPTY_CONTENT[key];
  }

  return parsed.data as SiteContent[K];
}

export function createFirestoreRepository(db: Firestore): ContentRepository {
  return {
    async load() {
      const snapshots = await Promise.all(SECTION_KEYS.map((key) => getDoc(doc(db, CONTENT_COLLECTION, key))));

      return SECTION_KEYS.reduce((content, key, index) => {
        const stored = snapshots[index].exists() ? (snapshots[index].data() as StoredDoc) : undefined;
        return { ...content, [key]: fromStoredDoc(key, stored) };
      }, EMPTY_CONTENT);
    },

    async saveSection(key, value) {
      const valid = sectionSchemas[key].parse(value);
      await setDoc(doc(db, CONTENT_COLLECTION, key), toStoredDoc(key, valid as typeof value));
    },
  };
}
