import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategy: "injectManifest",
      registerType: "autoUpdate",
      injectManifest: {
        swSrc: "src/sw.js",
        swDest: "sw.js",
      },
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: "Countdown Timer PWA",
        short_name: "Countdown",
        description: "Một ứng dụng đếm ngược sự kiện có thể cài đặt.",
        theme_color: "#1f2937",
        background_color: "#111827",
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
