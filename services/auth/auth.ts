import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { FirebaseServices } from "@/services/config/firebase";

export type AuthUser = {
  uid: string;
  email: string | null;
};

/** What the admin UI needs from an auth provider. */
export interface AuthService {
  onAuthChange(listener: (user: AuthUser | null) => void): () => void;
  isAdmin(uid: string): Promise<boolean>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

export const ADMINS_COLLECTION = "admins";

export function createFirebaseAuthService({ auth, db }: FirebaseServices): AuthService {
  return {
    onAuthChange(listener) {
      return onAuthStateChanged(auth, (user) => listener(user ? { uid: user.uid, email: user.email } : null));
    },

    // The admins/{uid} doc is created by hand in the Firebase console.
    // Security rules let a signed-in user read only their own doc there.
    async isAdmin(uid) {
      const snapshot = await getDoc(doc(db, ADMINS_COLLECTION, uid));
      return snapshot.exists();
    },

    async signIn() {
      await signInWithPopup(auth, new GoogleAuthProvider());
    },

    async signOut() {
      await firebaseSignOut(auth);
    },
  };
}
