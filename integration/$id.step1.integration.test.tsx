import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import Step1 from "../app/routes/$id.step1";
import { json } from "@remix-run/node";

const RemixStep1Stub = createRemixStub([
  {
    path: "/",
    Component: Step1,
    loader() {
      return json({ application: { id: "1" } });
    },
  },
]);

describe("Step 1 Form", () => {
  it("renders the form fields correctly", async () => {
    render(<RemixStep1Stub />);

    await waitFor(() => screen.findByText("Passport Number:"));
    await waitFor(() => screen.findByText("Date of Birth:"));
    await waitFor(() => screen.findByText("Nationality:"));
  });
});
