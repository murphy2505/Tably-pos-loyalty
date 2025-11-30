import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Alles wat met /pos begint -> naar POS backend
      "/pos": {
        target: "http://localhost:4002",
        changeOrigin: true,
      },
      // eventueel straks:
      // "/loyalty": {
      //   target: "http://localhost:4001",
      //   changeOrigin: true,
      // },
    },
  },
});
