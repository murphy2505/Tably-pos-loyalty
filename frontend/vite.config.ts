import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // 🔥 BELANGRIJK → maakt Vite bereikbaar op LAN (iPad)
    port: 5173,     // optioneel maar netjes
    proxy: {
      "/loyalty-api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/loyalty-api/, ""),
      },
    },
  },
});
