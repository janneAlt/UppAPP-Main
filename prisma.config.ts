import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read without env() so `prisma generate` (run on install) works when
    // DATABASE_URL isn't set; migrate and seed still need it. Migrations use
    // Neon's direct (unpooled) connection when the Vercel integration sets it.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  },
});
