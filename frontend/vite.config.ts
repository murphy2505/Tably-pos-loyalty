// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // iPad / netwerk
    port: 5173,
    proxy: {
      // ⭐ POS backend op 4002
      // Frontend gebruikt voortaan /pos-api/..., proxy herschrijft naar /pos/...
      "/pos-api": {
        target: "http://localhost:4002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pos-api/, "/pos"),
      },

      // ➜ Loyalty backend op 3000 (blijft hetzelfde)
      "/loyalty-api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/loyalty-api/, ""),
      },

      // ➜ Identity backend op 3001 (indien nodig)
      "/identity-api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/identity-api/, ""),
      },
    },
  },
});
