"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useRef, useState } from "react";
import Nav from "@/app/components/Nav";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import useGetUser from "@/hooks/useGetUser";
import Loader from "../loading";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { PostSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "@/lib/client";

type UploadForm = z.infer<typeof PostSchema>;

export default function Upload() {
  const {
    register,
    formState: { errors, isLoading },
    setValue,
    handleSubmit,
    setError,
  } = useForm<UploadForm>({
    resolver: zodResolver(PostSchema),
  });

  const { error, user } = useGetUser();

  const router = useRouter();

  const {
    data: topics,
    isLoading: isTopicsLoading,
    isError,
    error: topicError,
  } = useQuery({
    queryKey: ["get-topics"],
    queryFn: async () => {
      const res = await client.topic.getAllTopics.$get();
      const { topics } = await res.json();
      return topics;
    },
  });

  const mutation = useMutation({
    mutationKey: ["upload"],
    mutationFn: async (data: UploadForm) => {
      const res = await client.post.upload.$post(data);
      const { success, msg } = await res.json();
      if (success) {
        router.push("/feed?from=post");
      } else {
        setError("root", {
          message: String(msg),
        });
      }
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutate(data);
  });

  if (error.length !== 0) {
    if (error !== "User not logged in") return <div>Error: {error}</div>;
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <Nav />
      <div className="w-screen max h-screen flex flex-col items-center py-14 px-0 gap-8">
        <h1 className="text-xl text-center">Share Your Memories</h1>
        <div className="join w-11/12  flex max-w-lg "></div>
        <form
          className="flex flex-col gap-3 w-11/12 justify-center items-center text-start"
          onSubmit={onSubmit}
        >
          <label className="relative max-w-lg input input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Title..."
              className="w-full max-w-lg bg-transparent"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </label>
          <textarea
            className="textarea textarea-bordered h-40 max-w-lg w-full"
            placeholder="Body..."
            {...register("body")}
          ></textarea>
          {errors.body && (
            <p className="text-sm text-red-500">{errors.body.message}</p>
          )}
          <CldUploadWidget
            uploadPreset="social-nextest"
            onSuccess={(results) => {
              // @ts-ignore
              setValue("image", results.info?.secure_url);
            }}
          >
            {({ open }) => {
              return (
                <button type="button" onClick={() => open()}>
                  <div className=" file-input file-input-bordered w-[93svw] h-[2rem] max-w-lg">
                    <div className="w-[8rem] bg-[#2A323C] h-full rounded-s-md flex items-center justify-center">
                      <h1 className="font-bold text-sm">CHOOSE FILE</h1>
                    </div>
                    <div className="w-[13rem]  h-full"></div>
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
          <h1 className="w-full max-w-lg">File is optional</h1>
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image.message}</p>
          )}
          <div className="w-full flex justify-center items-center">
            <Controller
              render={() => (
                <select
                  className="select select-bordered w-full max-w-lg"
                  onChange={(e) =>
                    setValue("isPublic", e.target.value === "true")
                  }
                >
                  <option value="true">Public</option>
                  <option value="false">Private</option>
                </select>
              )}
              name="isPublic"
            />
            {errors.isPublic && (
              <p className="text-sm text-red-500">{errors.isPublic.message}</p>
            )}
          </div>
          <div className="w-full flex justify-center items-center">
            <Controller
              render={() => (
                <select
                  className="select select-bordered w-full max-w-lg"
                  onChange={(e) => setValue("topic", e.target.value)}
                >
                  <option value={"general"}>Global</option>
                  {topics?.map((topic) => (
                    <option key={topic.name} value={topic.name.toLowerCase()}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              )}
              name="topic"
            />
            {errors.topic && (
              <p className="text-sm text-red-500">{errors.topic.message}</p>
            )}
            {errors.root && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}
          </div>
          <button
            className="btn max-w-lg w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
