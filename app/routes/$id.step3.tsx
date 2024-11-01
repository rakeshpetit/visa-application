import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const application = await db.application.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    throw new Response("Not Found", { status: 404 });
  }

  // Ensure user completed previous steps
  if (application.currentStep < 3) {
    return redirect(`/${params.id}/step2`);
  }

  return { application };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const countryOfBirth = formData.get("countryOfBirth") as string;
  const gender = formData.get("gender") as string;
  const submitType = formData.get("submitType") as string;

  // Validate the data
  const errors: { [key: string]: string } = {};
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email is required";
  if (!email?.includes("@")) errors.email = "Invalid email format";
  if (!countryOfBirth) errors.countryOfBirth = "Country of birth is required";
  if (!gender) errors.gender = "Gender is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Update the application
  await db.application.update({
    where: { id: params.id },
    data: {
      firstName,
      lastName,
      email,
      countryOfBirth,
      gender,
      status: submitType === "submit" ? "SUBMITTED" : "DRAFT",
    },
  });

  if (submitType === "submit") {
    return redirect(`/${params.id}/success`);
  }

  // If just saving as draft
  return { success: true };
}

export default function Step3() {
  const { application } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Step 3: Personal Details</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block mb-1">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={application.firstName || ""}
            className={`w-full border rounded px-2 py-1 ${
              actionData?.errors?.firstName ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.firstName && (
            <span className="text-red-500 text-sm">
              {actionData.errors.firstName}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block mb-1">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={application.lastName || ""}
            className={`w-full border rounded px-2 py-1 ${
              actionData?.errors?.lastName ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.lastName && (
            <span className="text-red-500 text-sm">
              {actionData.errors.lastName}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="email"
            name="email"
            defaultValue={application.email || ""}
            className={`w-full border rounded px-2 py-1 ${
              actionData?.errors?.email ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.email && (
            <span className="text-red-500 text-sm">
              {actionData.errors.email}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="countryOfBirth" className="block mb-1">
            Country of Birth:
          </label>
          <input
            type="text"
            name="countryOfBirth"
            defaultValue={application.countryOfBirth || ""}
            className={`w-full border rounded px-2 py-1 ${
              actionData?.errors?.countryOfBirth ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.countryOfBirth && (
            <span className="text-red-500 text-sm">
              {actionData.errors.countryOfBirth}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block mb-1">
            Gender:
          </label>
          <select
            name="gender"
            defaultValue={application.gender || ""}
            className={`w-full border rounded px-2 py-1 ${
              actionData?.errors?.gender ? "border-red-500" : ""
            }`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {actionData?.errors?.gender && (
            <span className="text-red-500 text-sm">
              {actionData.errors.gender}
            </span>
          )}
        </div>

        {actionData?.success && (
          <div className="bg-green-100 text-green-700 p-2 rounded">
            Draft saved successfully!
          </div>
        )}

        <div className="flex justify-between">
          <a
            href={`/${application.id}/step2`}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </a>
          <div className="space-x-2">
            <button
              type="submit"
              name="submitType"
              value="draft"
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Save Draft
            </button>
            <button
              type="submit"
              name="submitType"
              value="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit Application
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
