"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="bg-green-700 hover:bg-green-800 rounded shadow p-2 px-4 text-xl text-white" aria-disabled={pending}>
      {pending ? "Uploading..." : "File Upload"}
    </button>
  );
}