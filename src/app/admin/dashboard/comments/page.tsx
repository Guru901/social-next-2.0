"use client";

import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/app/loading";
import { User } from "lucide-react";
import { client } from "@/lib/client";

export default function Comments() {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["get-comments"],
    queryFn: async () => {
      const res = await client.post.getAllComments.$get();
      const data = await res.json();
      return data.comments.reverse();
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col items-center">
        <p className="mb-4">Click on a comment to reach its source</p>
        {comments?.map((comment, index) => (
          <Link key={comment._id || index} href={`/p/${comment.post}`}>
            <div className="flex border-solid border-white p-2 gap-4 items-center">
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full ">
                      <User size={60} />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-xl w-[70vw] break-words">
                  {comment.user ? comment.user : "Ni Batu :)"}
                </h1>
                <h1 className="w-[70vw] break-words font-semibold ">
                  {comment.text}
                </h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
