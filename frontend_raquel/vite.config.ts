import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Em dev, encaminha as chamadas /api para o backend local (mesma origem que em produção).
  // Isso evita que /api caia no próprio Vite e retorne o index.html (o que quebrava a tela).
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});