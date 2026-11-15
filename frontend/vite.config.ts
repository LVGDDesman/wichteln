import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development the backend runs on :3000; in production nginx proxies /api.
    proxy: {
      "/api": process.env.VITE_BACKEND_URL ?? "http://localhost:3000",
    },
  },
})
