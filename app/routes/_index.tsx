import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function action() {
  const application = await db.application.create({
    data: {
      status: "DRAFT",
      currentStep: 1,
    },
  });

  return redirect(`/${application.id}/step1`);
}

export default function Start() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Start New Visa Application</h1>
      <Form method="post">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Application
        </button>
      </Form>
    </div>
  );
}
