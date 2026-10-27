import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { deleteApp, initializeApp, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

// Runs against the Firestore emulator: `npm run test:rules`.

const PROJECT_ID = "demo-portfolio";
const ADMIN_UID = "admin-uid";
// Set by `firebase emulators:exec`.
const [HOST, PORT] = (process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8181").split(":");

const apps: FirebaseApp[] = [];

/** A Firestore client signed in as `uid` (or signed out), using the same SDK as the site. */
function firestoreAs(uid?: string) {
  const app = initializeApp({ projectId: PROJECT_ID }, `client-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, Number(PORT), uid ? { mockUserToken: { sub: uid, user_id: uid } } : undefined);
  return db;
}

/** Creates admins/{uid} directly, bypassing rules (the emulator accepts the "owner" token). */
async function seedAdmin(uid: string) {
  const url = `http://${HOST}:${PORT}/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins?documentId=${uid}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields: {} }),
  });
  if (!response.ok) throw new Error(`Seeding admin failed: ${response.status} ${await response.text()}`);
}

const validProfile = {
  name: "Test Person",
  shortName: "Test",
  location: "",
  timezone: "",
  availability: "",
  intro: "",
  interests: [],
  contacts: [],
};

let env: RulesTestEnvironment;

beforeAll(async () => {
  // Loads firestore.rules into the emulator.
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: HOST, port: Number(PORT), rules: readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await Promise.all(apps.map((app) => deleteApp(app)));
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await seedAdmin(ADMIN_UID);
});

const anonymous = () => firestoreAs();
const stranger = () => firestoreAs("someone-else");
const admin = () => firestoreAs(ADMIN_UID);

describe("reading content", () => {
  it("is open to everyone", async () => {
    await assertSucceeds(getDoc(doc(anonymous(), "content", "profile")));
  });
});

describe("writing content", () => {
  it("is denied when signed out", async () => {
    await assertFails(setDoc(doc(anonymous(), "content", "profile"), validProfile));
  });

  it("is denied for signed-in users who are not the admin", async () => {
    await assertFails(setDoc(doc(stranger(), "content", "profile"), validProfile));
    await assertFails(setDoc(doc(stranger(), "content", "projects"), { items: [] }));
  });

  it("is allowed for the admin with valid data", async () => {
    await assertSucceeds(setDoc(doc(admin(), "content", "profile"), { ...validProfile, name: "Renamed" }));
    await assertSucceeds(setDoc(doc(admin(), "content", "projects"), { items: [] }));
    await assertSucceeds(setDoc(doc(admin(), "content", "posts"), { items: [] }));
    await assertSucceeds(setDoc(doc(admin(), "content", "education"), { items: [] }));
  });

  it("rejects bad shapes even from the admin", async () => {
    await assertFails(setDoc(doc(admin(), "content", "profile"), { ...validProfile, name: "" }));
    await assertFails(setDoc(doc(admin(), "content", "profile"), { ...validProfile, extra: "field" }));
    await assertFails(setDoc(doc(admin(), "content", "profile"), { ...validProfile, intro: "x".repeat(401) }));
    await assertFails(setDoc(doc(admin(), "content", "projects"), { items: "not a list" }));
    await assertFails(setDoc(doc(admin(), "content", "projects"), { items: Array(51).fill({}) }));
  });

  it("rejects unknown sections and deletes", async () => {
    await assertFails(setDoc(doc(admin(), "content", "secrets"), { items: [] }));
    await assertFails(deleteDoc(doc(admin(), "content", "profile")));
    await assertFails(setDoc(doc(admin(), "other", "doc"), { a: 1 }));
  });
});

describe("the admins collection", () => {
  it("lets a user check only their own entry", async () => {
    await assertSucceeds(getDoc(doc(admin(), "admins", ADMIN_UID)));
    await assertSucceeds(getDoc(doc(stranger(), "admins", "someone-else")));
    await assertFails(getDoc(doc(stranger(), "admins", ADMIN_UID)));
    await assertFails(getDoc(doc(anonymous(), "admins", ADMIN_UID)));
  });

  it("cannot be written by anyone, so nobody can make themselves admin", async () => {
    await assertFails(setDoc(doc(stranger(), "admins", "someone-else"), {}));
    await assertFails(setDoc(doc(admin(), "admins", "someone-else"), {}));
  });
});
