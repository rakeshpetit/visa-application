import { describe, test, beforeAll, afterAll, expect } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Database Tests", () => {
  test("Create and retrieve the draft application details", async () => {
    const application = await prisma.application.create({
      data: {
        passportNumber: "123456789",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "USA",
        purposeOfVisit: "Tourism",
        arrivalDate: new Date("2023-10-01"),
        departureDate: new Date("2023-10-10"),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        countryOfBirth: "USA",
        gender: "Male",
      },
    });

    // Retrieve the user
    const retrievedApplication = await prisma.application.findUnique({
      where: { id: application.id },
    });

    expect(retrievedApplication).toEqual(application);
    expect(retrievedApplication?.status).toBe("DRAFT");
  });

  test("Submit a draft application", async () => {
    const application = await prisma.application.findFirst({
      where: { status: "DRAFT" },
    });

    // Retrieve the user
    const updatedApplication = await prisma.application.update({
      where: { id: application?.id },
      data: {
        status: "SUBMITTED",
      },
    });

    expect(updatedApplication?.status).toBe("SUBMITTED");
  });
});
