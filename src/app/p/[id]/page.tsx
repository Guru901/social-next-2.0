"use client";

import { usePathname } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Nav from "@/app/components/Nav";
import Image from "next/image";
import { getDateDifference } from "@/lib/getDateDifference";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Options } from "./options";
import { useUserStore } from "@/stores/userStore";
import { CldUploadWidget } from "next-cloudinary";
import { Loader2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { Comment } from "@/app/components/Comment";
import Link from "next/link";
import Loader from "@/app/loading";
import { client } from "@/lib/client";
import { z } from "zod";
import { CommentSchema } from "@/lib/schemas";

type Comment = z.infer<typeof CommentSchema>;

export default function Post() {
  const [post, setPost] = useState({
    title: "",
    body: "",
    image: "",
    createdAt: "",
    user: {
      username: "",
      avatar: "",
    },
    topic: "",
  });

  const [replyTo, setReplyTo] = useState("");
  const inpRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { user } = useUserStore();

  const [commentData, setCommentData] = useState({
    comment: "",
    image: "",
    postId: "",
  });

  const postIDArray = pathname.split("/p/");
  const postId = postIDArray.length > 1 ? postIDArray[1] : null;

  const {
    isLoading: isPostLoading,
    isError,
    isPending,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["get-post", postId],
    queryFn: async () => {
      const res = await client.post.getPostById.$get({ postId: postId });
      const data = await res.json();
      setPost(data.post);
      return data;
    },
  });

  const { data: comments, refetch } = useQuery({
    queryKey: ["get-comments", postId],
    queryFn: async () => {
      const res = await client.post.getComments.$get({ postId });
      const data = await res.json();
      return data.comments.reverse();
    },
    refetchInterval: 650,
  });

  const mutation = useMutation({
    mutationKey: ["comment"],
    mutationFn: async (data: Comment) => {
      await client.post.comment.$post(data);
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      avatar: user.avatar,
      username: user.username,
      replyTo: replyTo,
      comment: commentData.comment,
      image: commentData.image,
      postId: commentData.postId,
    });
    setCommentData({
      comment: "",
      postId: postId,
      image: "",
    });
    refetch();
  };

  async function handleDelete(id: string) {
    console.log(id);
    try {
      await client.post.handleDeleteComment.$get({
        commentId: id,
      });

      refetch();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  if (isError) return <div>Error</div>;

  const username = post?.user?.username.replace(" ", "_");
  if (post?.image) {
    post.image = post?.image.split("djna5slqw").join("daxbi6fhs");
  }

  useEffect(() => {
    setCommentData({
      ...commentData,
      postId: postId,
    });
  }, [postId]);

  return (
    <div className="w-full flex flex-col justify-center pl-1 items-center">
      <Nav />
      <div className="flex flex-col items-center mt-6 gap-4 w-full">
        <div className="flex flex-col gap-10 w-sreen">
          <div className="w-full flex px-4 pt-4 justify-center max-w-[30rem]">
            <div className="flex flex-col gap-4 w-full overflow-hidden">
              {isPostLoading || isPending ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="flex gap-2 items-center w-full p-2 max-w-96">
                    <div className="avatar">
                      <Image
                        src={post?.user?.avatar || ""}
                        alt={post?.user?.username || "avatar"}
                        priority={true}
                        width={60}
                        height={60}
                        className="rounded-full max-w-16 min-h-16"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/u/${username}`}
                        className="font-semibold underline"
                      >
                        @{post?.user?.username}
                      </Link>
                      <p className="text-sm text-zinc-500">
                        {getDateDifference(post?.createdAt)?.toLocaleString()}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {post?.topic?.charAt(0)?.toUpperCase() +
                          post?.topic?.slice(1)}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-3xl">{post?.title}</h1>
                  {post?.image &&
                  (post.image.endsWith(".mp4") ||
                    post.image.endsWith(".mkv")) ? (
                    <video
                      controls
                      className="rounded-lg mx-auto"
                      width="100%"
                      height="auto"
                      preload="auto"
                      autoPlay={false}
                    >
                      <source src={post.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : post?.image ? (
                    <Image
                      src={post.image}
                      className="rounded-lg mx-auto"
                      width={29000}
                      height={158}
                      alt={post.title}
                      priority={true}
                      loading="eager"
                    />
                  ) : (
                    ""
                  )}
                  <div>
                    <div>
                      {post?.body && post?.body.includes("\n") ? (
                        post?.body &&
                        post?.body
                          .split("\n")
                          .filter((x) => x !== "")
                          .map((y) => (
                            <p className="text-md" key={y}>
                              {y}
                            </p>
                          ))
                      ) : (
                        <p className="text-md">{post?.body}</p>
                      )}
                    </div>
                  </div>

                  <Options
                    post={post}
                    setPost={setPost}
                    refetch={refetchPost}
                  />

                  <h1 className="text-sm font-bold">
                    {getDateDifference(post?.createdAt)?.toLocaleString()}
                  </h1>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center">
              <form className="flex gap-2" onSubmit={onSubmit}>
                <label className="relative w-[69vw] max-w-xl input input-bordered flex items-center gap-2 justify-between">
                  <input
                    ref={inpRef}
                    type="text"
                    value={commentData.comment}
                    name="comment"
                    onChange={(e) =>
                      setCommentData({
                        ...commentData,
                        comment: e.target.value,
                      })
                    }
                    className="w-[90%] bg-transparent"
                    placeholder="Enter Your Comment.."
                  />
                  <CldUploadWidget
                    uploadPreset="social-nextest"
                    onSuccess={(results) => {
                      setCommentData({
                        ...commentData,
                        // @ts-ignore
                        image: results.info.securl_url,
                      });
                    }}
                  >
                    {({ open }) => {
                      return (
                        <button type="button" onClick={() => open()}>
                          <ImageIcon />
                        </button>
                      );
                    }}
                  </CldUploadWidget>
                </label>
                <button
                  className="btn"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Comment"
                  )}
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <div className="w-[96vw] max-w-xl">
                {comments?.map(
                  (comment: {
                    _id: string;
                    text: string;
                    avatar: string;
                    createdAt: string;
                    user: string;
                    image?: string;
                    isAReply?: boolean;
                    replies: string[];
                  }) => (
                    <Comment
                      comments={comments.filter((comment) => comment.isAReply)}
                      comment={comment}
                      handleDelete={handleDelete}
                      inpRef={inpRef}
                      setReplyTo={setReplyTo}
                      key={comment._id}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
