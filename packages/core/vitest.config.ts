import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 其他配置选项
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
