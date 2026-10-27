"use client";

import { useEffect, useState } from "react";
import { useLikesRepository } from "@/services/likes/LikesProvider";

/** Like count for one item. Each like shows instantly and is rolled back if saving fails. */
export function useLike(likeId: string) {
  const repository = useLikesRepository();
  const [count, setCount] = useState<number | null>(null);
  // Fills the heart once this visitor has liked the item during this visit.
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!repository) return;
    let alive = true;

    repository
      .getCount(likeId)
      .then((loaded) => alive && setCount(loaded))
      .catch((error) => console.warn(`Could not load likes for ${likeId}`, error));

    return () => {
      alive = false;
    };
  }, [repository, likeId]);

  async function like() {
    if (!repository || count === null) return;

    setCount((current) => (current ?? 0) + 1);
    setLiked(true);

    try {
      await repository.like(likeId);
    } catch (error) {
      console.warn(`Could not save like for ${likeId}`, error);
      setCount((current) => Math.max(0, (current ?? 1) - 1));
    }
  }

  return { ready: count !== null, count: count ?? 0, liked, like };
}
