"use client";

import Image from "next/image";
import { getDateDifference } from "@/lib/getDateDifference";
import {
  handleDisLike,
  handleDisUnlike,
  handleLike,
  handleUnLike,
} from "@/lib/likeUtils";
import Link from "next/link";
import { useState, startTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import useGetUser from "@/hooks/useGetUser";

function CopyToast() {
  return (
    <div className="toast toast-center z-[999]">
      <div className="alert alert-info">
        <span>Link copied to clipboard</span>
      </div>
    </div>
  );
}

export default function PostCard({
  post,
  refetch,
}: {
  post: {
    _id: string;
    title: string;
    body: string;
    image: string;
    createdAt: string;
    username: string;
    user: {
      username: string;
      avatar: string;
    };
    likes: string[];
    dislikes: string[];
  };
  refetch: () => void;
}) {
  const { user } = useGetUser();

  const router = useRouter();

  const [optimisticLikes, setOptimisticLikes] = useState(
    post?.likes?.length || 0
  );
  const [optimisticDislikes, setOptimisticDislikes] = useState(
    post?.dislikes?.length || 0
  );
  const [hasLiked, setHasLiked] = useState(post?.likes?.includes(user?._id));
  const [hasDisliked, setHasDisliked] = useState(
    post?.dislikes?.includes(user?._id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleOptimisticLike = async () => {
    if (isLoading) return;

    startTransition(() => {
      setIsLoading(true);
      setHasLiked(true);
      setOptimisticLikes((likes) => likes + 1);
      if (hasDisliked) {
        setHasDisliked(false);
        setOptimisticDislikes((dislikes) => dislikes - 1);
      }
    });

    try {
      await handleLike(post._id, refetch);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimisticUnlike = async () => {
    if (isLoading) return;

    startTransition(() => {
      setIsLoading(true);
      setHasLiked(false);
      setOptimisticLikes((likes) => likes - 1);
    });

    try {
      await handleUnLike(post._id, refetch);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimisticDislike = async () => {
    if (isLoading) return;

    startTransition(() => {
      setIsLoading(true);
      setHasDisliked(true);
      setOptimisticDislikes((dislikes) => dislikes + 1);
      if (hasLiked) {
        setHasLiked(false);
        setOptimisticLikes((likes) => likes - 1);
      }
    });

    try {
      await handleDisLike(post._id, refetch);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimisticUndislike = async () => {
    if (isLoading) return;

    startTransition(() => {
      setIsLoading(true);
      setHasDisliked(false);
      setOptimisticDislikes((dislikes) => dislikes - 1);
    });

    try {
      await handleDisUnlike(post._id, refetch);
    } finally {
      setIsLoading(false);
    }
  };

  const username = post?.user?.username.replace(" ", "_");

  if (post.image) {
    post.image = post.image.split("djna5slqw").join("daxbi6fhs");
  }

  return (
    <div className="card bg-base-100 shadow-xl w-full singlePost border border-gray-50/10">
      <>
        <figure className="flex flex-col gap-2">
          <div className="flex gap-2 items-center w-full p-2">
            <div className="avatar">
              <Image
                src={post?.user?.avatar || "/avatar.png"}
                alt={post?.user?.username || "avatar"}
                priority={true}
                loading="eager"
                width={60}
                height={60}
                className="rounded-full max-w-16 min-h-16 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <Link href={`/u/${username}`} className="font-semibold underline">
                @{post?.user?.username}
              </Link>
              <p className="text-sm font-light text-zinc-400">
                {getDateDifference(post?.createdAt)?.toLocaleString()}
              </p>
            </div>
          </div>
        </figure>
        <div className="card-body gap-1 p-4 flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div>
              <h2 className="card-title text-xl text-white font-[500]">
                {post.title}
              </h2>
              <p className="max-h-24 text-[16px] overflow-hidden">
                {post.body &&
                  post?.body
                    .split("\n")
                    .filter((x) => x !== "")
                    .map((y) => <p>{y}</p>)}
              </p>
            </div>
            {post?.image?.length > 0 ? (
              post.image.endsWith(".mp4") || post.image.endsWith(".mkv") ? (
                <video
                  src={post.image}
                  autoPlay={false}
                  controls={true}
                  preload="auto"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={256}
                  priority={true}
                  height={128}
                  className="w-full max-h-60 object-cover rounded-md"
                  loading="eager"
                />
              )
            ) : null}
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-2 text-xl mt-4 items-start">
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  {hasLiked ? (
                    <ThumbsUp
                      className="fill-current"
                      size={24}
                      onClick={handleOptimisticUnlike}
                    />
                  ) : (
                    <ThumbsUp size={24} onClick={handleOptimisticLike} />
                  )}
                  <h1>{optimisticLikes}</h1>
                </div>
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  {hasDisliked ? (
                    <ThumbsDown
                      className="fill-current"
                      size={24}
                      onClick={handleOptimisticUndislike}
                    />
                  ) : (
                    <ThumbsDown size={24} onClick={handleOptimisticDislike} />
                  )}
                  <h1>{optimisticDislikes}</h1>
                </div>
                <div
                  className="flex flex-col mx-2 items-center justify-center cursor-pointer"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        window.location.origin + `/p/${post._id}`
                      );
                      setShowToast(true);
                      setTimeout(() => {
                        setShowToast(false);
                      }, 2000);
                    } catch (err) {
                      console.error("Failed to copy: ", err);
                    }
                  }}
                >
                  <Share2 />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end justify-center">
                <Link
                  href={`/p/${post._id}`}
                  prefetch={true}
                  onMouseDown={() => router.push(`/p/${post._id}`)}
                >
                  <button className="btn btn-neutral">See more</button>
                </Link>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </>
      {showToast && <CopyToast />}
    </div>
  );
}
