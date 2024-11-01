import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!globalThis.__db) {
    globalThis.__db = new PrismaClient();
  }
  db = globalThis.__db;
}

export { db };
