import { defineConfig } from "vite";

export default defineConfig({
  base: "/opmarkers/",
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cross-Origin-Resource-Policy": "cross-origin"
    }
  }
});