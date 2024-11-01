import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const application = await db.application.findUnique({
    where: { id: params.id },
  });

  if (!application || application.status !== "SUBMITTED") {
    throw new Response("Not Found", { status: 404 });
  }

  return { application };
}

export default function Success() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-red-200 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Application Submitted Successfully!
        </h1>
        <p className="mb-4 text-gray-800">
          Thank you, {application.firstName}! Your application has been
          submitted successfully.
        </p>
        <p className="text-sm text-gray-500">
          Application ID: {application.id}
        </p>
        <p className="text-sm text-gray-500">
          Submitted on: {new Date().toLocaleDateString()}
        </p>
        <a
          href="/"
          className="block mt-6 text-center bg-green-500 text-white px-4 py-2 rounded"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
