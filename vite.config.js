import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite Configuration
export default defineConfig({
  plugins: [
    react(),
    legacy(),
  ],
  build: {
    outDir: "www", // For Capacitor compatibility
  },
});
