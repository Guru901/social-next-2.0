"use client";

import { getDateDifference } from "@/lib/getDateDifference";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import Loader from "@/app/loading";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function Posts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["get-posts"],
    queryFn: async () => {
      const res = await client.post.getAllPostForAdmin.$get();
      const data = await res.json();
      return data.posts.reverse();
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="flex feedContainer flex-col justify-start gap-5 px-3 pb-16">
      {posts?.map((post) =>
        post.image && post.image.split("djna5slqw").join("daxbi6fhs") ? (
          <div
            key={post._id}
            className="card max-w-96 bg-base-100 shadow-xl w-screen singlePost"
          >
            <>
              <figure>
                {post.image &&
                (post.image.endsWith(".mp4") || post.image.endsWith(".mkv")) ? (
                  <video src={post.image} autoPlay={false} preload="auto">
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={256}
                    height={128}
                    className="w-full max-h-60 object-cover"
                    priority={true}
                    loading="eager"
                  />
                )}
              </figure>
              <div className="card-body gap-1 p-4 flex-row justify-between">
                <div className="w-[14rem]">
                  <h2 className="card-title text-white font-bold">
                    Author - {post.username ? post.username : "User"}
                  </h2>
                  <h2 className="card-title">{post.title}</h2>
                  <p className="max-h-24 overflow-hidden">{post.body}</p>
                  <div className="flex gap-2 text-xl mt-4">
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <ThumbsUp size={24} />

                      <h1>{post?.likes?.length}</h1>
                    </div>
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <ThumbsDown size={24} />
                      <h1>{post.dislikes?.length}</h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <Link href={`/p/${post._id}`}>
                    <button className="btn btn-neutral">See more</button>
                  </Link>
                  <div>
                    <h1 className="text-sm font-bold">
                      {getDateDifference(post?.createdAt)?.toLocaleString()}
                    </h1>
                  </div>
                </div>
              </div>
            </>
          </div>
        ) : (
          <div
            className="card max-w-96 w-[100vw] bg-base-100 shadow-xl singlePost"
            key={post._id}
          >
            <div className="card-body flex flex-col justify-between items-stretch p-4">
              <div className="flex flex-col gap-2">
                <h2 className="card-title text-white">
                  Author - {post.username ? post.username : "User"}
                </h2>
                <h2 className="card-title">{post.title}</h2>
                <div className="flex items-end">
                  <p className="max-h-24 overflow-hidden w-[17rem]">
                    {post.body}
                  </p>
                </div>
              </div>

              <div className="card-actions justify-between items-center">
                <div className="flex gap-2 text-xl mt-4">
                  <button>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <ThumbsUp size={24} />

                        <h1>{post?.likes?.length}</h1>
                      </div>
                    </div>
                  </button>
                  <button>
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <ThumbsDown size={24} />
                      <h1>{post?.dislikes?.length}</h1>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <Link href={`/p/${post._id}`}>
                    <button className="btn btn-neutral">See more</button>
                  </Link>
                  <div>
                    <h1 className="text-sm font-bold">
                      {getDateDifference(post?.createdAt)?.toLocaleString()}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
