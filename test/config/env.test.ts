import { describe, expect, it } from "vitest";
import { readFirebaseEnv } from "@/services/config/env";

const complete = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:2:web:3",
};

describe("readFirebaseEnv", () => {
  it("returns the config when all required values are set", () => {
    expect(readFirebaseEnv(complete)).toEqual({
      apiKey: "key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo",
      appId: "1:2:web:3",
      recaptchaSiteKey: undefined,
      appCheckDebugToken: undefined,
    });
  });

  it("returns null when any required value is missing", () => {
    expect(readFirebaseEnv({ ...complete, NEXT_PUBLIC_FIREBASE_PROJECT_ID: "" })).toBeNull();
    expect(readFirebaseEnv({})).toBeNull();
  });

  it("includes the optional App Check values when present", () => {
    const env = readFirebaseEnv({ ...complete, NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "site" });
    expect(env?.recaptchaSiteKey).toBe("site");
  });
});
