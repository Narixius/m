import { defineConfig } from "drizzle-kit";
import fs from "node:fs";

let sqliteFile;
if (fs.existsSync("./.wrangler"))
  sqliteFile = fs
    .readdirSync("./.wrangler")
    .filter((file) => file.endsWith(".sqlite"))
    .map((file) => `file:.wrangler/${file}`)[0];
else sqliteFile = "";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: sqliteFile,
  },
});
