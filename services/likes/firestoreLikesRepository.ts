import { doc, getDoc, increment, setDoc, type Firestore } from "firebase/firestore";
import type { LikesRepository } from "@/services/likes/LikesRepository";

/*
 * Firestore layout:
 *   likes/{likeId} -> { count }
 * Anyone can read a count and add 1 to it; firestore.rules reject any other change.
 */

export const LIKES_COLLECTION = "likes";

export function createFirestoreLikesRepository(db: Firestore): LikesRepository {
  const likeDoc = (likeId: string) => doc(db, LIKES_COLLECTION, likeId);

  return {
    async getCount(likeId) {
      const snapshot = await getDoc(likeDoc(likeId));
      return snapshot.exists() ? Number(snapshot.data().count) || 0 : 0;
    },

    async like(likeId) {
      // increment() is applied by the server, so simultaneous likes from different visitors all count.
      await setDoc(likeDoc(likeId), { count: increment(1) }, { merge: true });
    },
  };
}
