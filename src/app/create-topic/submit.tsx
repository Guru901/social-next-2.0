"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn w-[calc(100vw-16px)] max-w-96"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Topic"}
    </button>
  );
}
