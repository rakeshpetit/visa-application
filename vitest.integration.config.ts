import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./integration/setup.ts",
    include: ["**/*.integration.test.{js,jsx,ts,tsx}"],
  },
});
