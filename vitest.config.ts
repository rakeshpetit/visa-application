// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "test",
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
  },
});
