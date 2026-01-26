import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  env: {
    schema: {
      NOW_PAYMENT_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      NOW_PAYMENT_IPN_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      NOW_PAYMENT_API_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      SUPPORT_URL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  vite: {
    server: {
      allowedHosts: ["np.xrouter.shop"],
    },
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
