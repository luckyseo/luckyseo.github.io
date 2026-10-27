/** Like counts for projects and posts. Visitors may like as many times as they want. */
export interface LikesRepository {
  getCount(likeId: string): Promise<number>;
  /** Adds one like. */
  like(likeId: string): Promise<void>;
}

/** Firestore document id for an item's likes, e.g. "project-portfolio". */
export function likeIdFor(kind: "project" | "post", itemId: string) {
  return `${kind}-${itemId}`;
}
