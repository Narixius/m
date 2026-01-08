import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  vite: {
    ssr: {
      external: [
        "node:buffer",
        "node:fs/promises",
        "node:path",
        "node:url",
        "node:crypto",
      ],
    },
    plugins: [tailwindcss()],
  },
});
