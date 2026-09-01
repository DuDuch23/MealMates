import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    headers: {
      // Requis pour la popup Google OAuth (One Tap / SSO)
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
