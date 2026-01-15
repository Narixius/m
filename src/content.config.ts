import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const changelog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/changelog",
  }),
  schema: z.object({
    contributors: z.array(z.string()),
  }),
});

export const collections = { changelog };
