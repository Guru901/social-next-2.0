"use client";

import Nav from "@/app/components/Nav";
import { client } from "@/lib/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CreateTopic() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.topic.createTopic.$post({
      name: data.title,
    });
    const { success, msg } = await res.json();
    if (success) {
      router.push("/feed");
    } else {
      setError("root", {
        message: String(msg),
      });
    }
  });

  return (
    <div className="flex flex-col h-screen gap-24">
      <Nav />
      <div className="flex flex-col gap-20 justify-center items-center">
        <h1 className="text-[currentColor] text-3xl text-center">
          Create A Custom Topic!!
        </h1>
        <form
          className="flex flex-col gap-2 px-4 justify-center items-center"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            {...register("title")}
            className="input input-bordered w-[calc(100vw-16px)] max-w-96"
            placeholder="Title of Topic.."
          />
          {errors.title && (
            <p className="text-sm text-red-500">
              {String(errors.title.message)}
            </p>
          )}
          {errors.root && (
            <p className="text-sm text-red-500">
              {String(errors.root.message)}
            </p>
          )}
          <button
            type="submit"
            className="btn w-[calc(100vw-16px)] max-w-96"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Create Topic"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
