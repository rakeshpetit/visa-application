import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const application = await db.application.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    throw new Response("Not Found", { status: 404 });
  }

  // Ensure user completed previous step
  if (application.currentStep < 2) {
    return redirect(`/${params.id}/step1`);
  }

  return { application };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const purposeOfVisit = formData.get("purposeOfVisit") as string;
  const arrivalDate = formData.get("arrivalDate") as string;
  const departureDate = formData.get("departureDate") as string;

  if (!purposeOfVisit || !arrivalDate || !departureDate) {
    return { error: "All fields are required" };
  }

  await db.application.update({
    where: { id: params.id },
    data: {
      purposeOfVisit,
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      currentStep: 3,
    },
  });

  return redirect(`/${params.id}/step3`);
}

export default function Step2() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Step 2: Visit Details</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="purposeOfVisit" className="block mb-1">
            Purpose of Visit:
          </label>
          <input
            type="text"
            name="purposeOfVisit"
            defaultValue={application.purposeOfVisit || ""}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label htmlFor="arrivalDate" className="block mb-1">
            Arrival Date:
          </label>
          <input
            type="date"
            name="arrivalDate"
            defaultValue={
              application.arrivalDate
                ? new Date(application.arrivalDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label htmlFor="departureDate" className="block mb-1">
            Departure Date:
          </label>
          <input
            type="date"
            name="departureDate"
            defaultValue={
              application.departureDate
                ? new Date(application.departureDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="flex justify-between">
          <a
            href={`/${application.id}/step1`}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </a>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next Step
          </button>
        </div>
      </Form>
    </div>
  );
}
