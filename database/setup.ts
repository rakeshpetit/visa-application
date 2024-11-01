// test/setup.ts
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

export default async () => {
  // Migrate the test database
  execSync("npx prisma migrate deploy --preview-feature");

  // Seed the test database if needed
  const prisma = new PrismaClient();
  await prisma.$connect();
  // Add seeding logic here
  await prisma.$disconnect();
};
