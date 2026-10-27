import { initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { readFirebaseEnv, type FirebaseEnv } from "@/services/config/env";

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let services: FirebaseServices | null = null;

declare global {
  // Read by the App Check SDK when running on localhost.
  var FIREBASE_APPCHECK_DEBUG_TOKEN: string | boolean | undefined;
}

function startAppCheck(app: FirebaseApp, env: FirebaseEnv) {
  if (!env.recaptchaSiteKey) return;

  if (window.location.hostname === "localhost" && env.appCheckDebugToken) {
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = env.appCheckDebugToken;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(env.recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

/**
 * Initialises Firebase once, in the browser only.
 * Returns null when Firebase is not configured (missing .env values) or during prerendering.
 */
export function getFirebase(): FirebaseServices | null {
  if (services) return services;
  if (typeof window === "undefined") return null;

  const env = readFirebaseEnv();
  if (!env) return null;

  const app = initializeApp({
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    appId: env.appId,
  });
  startAppCheck(app, env);

  services = { app, auth: getAuth(app), db: getFirestore(app) };
  return services;
}
