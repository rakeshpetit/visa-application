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

  return { application };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const passportNumber = formData.get("passportNumber") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const nationality = formData.get("nationality") as string;

  // Validate the data
  if (!passportNumber || !dateOfBirth || !nationality) {
    return { error: "All fields are required" };
  }

  // Update the application
  await db.application.update({
    where: { id: params.id },
    data: {
      passportNumber,
      dateOfBirth: new Date(dateOfBirth),
      nationality,
      currentStep: 2,
    },
  });

  return redirect(`/${params.id}/step2`);
}

export default function Step1() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Step 1: Personal Information</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="passportNumber" className="block mb-1">
            Passport Number:
          </label>
          <input
            type="text"
            name="passportNumber"
            defaultValue={application.passportNumber || ""}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block mb-1">
            Date of Birth:
          </label>
          <input
            type="date"
            name="dateOfBirth"
            defaultValue={
              application.dateOfBirth
                ? new Date(application.dateOfBirth).toISOString().split("T")[0]
                : ""
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label htmlFor="nationalityr" className="block mb-1">
            Nationality:
          </label>
          <input
            type="text"
            name="nationality"
            defaultValue={application.nationality || ""}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="flex justify-between">
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
