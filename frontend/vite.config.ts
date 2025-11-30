import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",   // ← maakt 5173 zichtbaar op je netwerk (iPad werkt hiermee)
    port: 5173,

    proxy: {
      // ➜ POS backend op 4002
      "/pos": {
        target: "http://localhost:4002",
        changeOrigin: true,
      },

      // ➜ Loyalty backend op 3000
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
