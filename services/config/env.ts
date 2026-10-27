export type FirebaseEnv = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  /** reCAPTCHA v3 site key for Firebase App Check (optional). */
  recaptchaSiteKey?: string;
  /** App Check debug token, only used on localhost (optional). */
  appCheckDebugToken?: string;
};

type EnvSource = Record<string, string | undefined>;

// NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them at build time.
const buildTimeEnv: EnvSource = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN: process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN,
};

/** Returns the Firebase config, or null when the required values are not set. */
export function readFirebaseEnv(source: EnvSource = buildTimeEnv): FirebaseEnv | null {
  const env = {
    apiKey: source.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: source.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: source.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: source.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!env.apiKey || !env.authDomain || !env.projectId || !env.appId) return null;

  return {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    appId: env.appId,
    recaptchaSiteKey: source.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || undefined,
    appCheckDebugToken: source.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || undefined,
  };
}
