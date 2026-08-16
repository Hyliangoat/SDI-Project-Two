import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const exoplanetProxy = {
  target: "https://exoplanetarchive.ipac.caltech.edu",
  changeOrigin: true,
  secure: true,
  rewrite: (path) => path.replace(/^\/api\/exoplanets/, ""),
};

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api/exoplanets": exoplanetProxy,
    },
  },

  preview: {
    proxy: {
      "/api/exoplanets": exoplanetProxy,
    },
  },
});
