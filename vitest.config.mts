import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.{ts,tsx}"],
    // Rules tests need the Firestore emulator: run them with `npm run test:rules`.
    exclude: [...configDefaults.exclude, "test/rules/**"],
  },
});
