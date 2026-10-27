import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Firestore } from "firebase/firestore";
import { sampleContent } from "@/test/fixtures";

// In-memory stand-in for the Firestore functions the repository uses.
const store = new Map<string, Record<string, unknown>>();

vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, collection: string, id: string) => `${collection}/${id}`,
  getDoc: async (path: string) => ({
    exists: () => store.has(path),
    data: () => store.get(path),
  }),
  setDoc: vi.fn(async (path: string, data: Record<string, unknown>) => {
    store.set(path, data);
  }),
}));

const { createFirestoreRepository, fromStoredDoc, toStoredDoc } = await import("@/services/content/firestoreRepository");
const { EMPTY_CONTENT } = await import("@/services/content/defaults");

const db = {} as Firestore;

describe("firestoreRepository", () => {
  beforeEach(() => {
    store.clear();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("stores the profile as-is and lists under `items`", () => {
    const content = sampleContent();
    expect(toStoredDoc("profile", content.profile)).toEqual(content.profile);
    expect(toStoredDoc("projects", content.projects)).toEqual({ items: content.projects });
  });

  it("falls back to empty content for missing or invalid docs", () => {
    expect(fromStoredDoc("posts", undefined)).toEqual([]);
    expect(fromStoredDoc("posts", { items: [{ title: 42 }] })).toEqual([]);
    expect(fromStoredDoc("profile", { name: "only a name" })).toEqual(EMPTY_CONTENT.profile);
  });

  it("round-trips every section through save and load", async () => {
    const repository = createFirestoreRepository(db);
    const content = sampleContent();

    await repository.saveSection("profile", content.profile);
    await repository.saveSection("education", content.education);
    await repository.saveSection("projects", content.projects);
    await repository.saveSection("posts", content.posts);

    expect(store.get("content/projects")).toEqual({ items: content.projects });
    expect(await repository.load()).toEqual(content);
  });

  it("loads empty content from an empty database", async () => {
    expect(await createFirestoreRepository(db).load()).toEqual(EMPTY_CONTENT);
  });

  it("refuses to save invalid data", async () => {
    const repository = createFirestoreRepository(db);
    const bad = [{ ...sampleContent().projects[0], images: ["javascript:alert(1)"] }];

    await expect(repository.saveSection("projects", bad)).rejects.toThrow();
    expect(store.has("content/projects")).toBe(false);
  });
});
