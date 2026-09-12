import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "."),
    },
  },
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // O núcleo financeiro precisa de cobertura real; UI é verificada por amostragem.
      include: ["lib/calculations/**", "lib/finance/**", "lib/validation/**"],
    },
  },
});
