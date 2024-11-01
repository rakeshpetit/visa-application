// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "database",
    globals: true,
    environment: "node",
    setupFiles: ["./database/setup.ts"],
  },
});
