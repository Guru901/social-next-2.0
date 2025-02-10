"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import { useQuery } from "@tanstack/react-query";
import useGetUser from "@/hooks/useGetUser";
import UserDetails from "@/app/components/UserDetails";
import { client } from "@/lib/client";
import Loader from "../loading";

export default function Profile() {
  const [selectedOption, setSelectedOption] = useState("publicPosts");
  const { user, error } = useGetUser();

  const PostItems = [
    { label: "Public Posts", selectedOption: "publicPosts" },
    { label: "Private Posts", selectedOption: "privatePosts" },
    { label: "Liked Posts", selectedOption: "likedPosts" },
  ];

  const {
    data: posts,
    isLoading,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["userPosts", selectedOption],
    queryFn: async () => {
      if (selectedOption === "likedPosts") {
        const res = await client.post.getUserLikedPosts.$get();
        const { posts } = await res.json();
        return posts.reverse();
      } else {
        const res = await client.user.getUserPosts.$post({
          isPublic: selectedOption === "publicPosts",
        });
        const { posts } = await res.json();
        return posts.reverse();
      }
    },
  });

  useEffect(() => {
    if (user?._id) {
      refetch();
    }
  }, [selectedOption, refetch]);

  if (isLoading || isPending) return <Loader />;

  if (error.length !== 0) {
    if (error !== "User not logged in") return <div>Error: {error}</div>;
  }
  return (
    <div className="flex flex-col w-[100svw] min-h-screen">
      <div>
        <Nav />
        <UserDetails user={user} posts={[]} isProfile={true} />
      </div>

      <div className="flex flex-col gap-4 w-full bg-gray-900 z-10">
        <div className="divider m-0"></div>
        <div className="flex justify-center w-[100svw] max-x-[26rem]">
          <div className="join w-[26rem]">
            {PostItems.map((postItem) => (
              <input
                className="join-item btn max-w-[8.66rem] w-[33%]"
                name="options"
                type="radio"
                key={postItem.label}
                aria-label={postItem.label}
                checked={selectedOption === postItem.selectedOption}
                onChange={() => setSelectedOption(postItem.selectedOption)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col md:flex-row  md:flex-wrap justify-start items-center gap-2 w-screen md:w-[26rem] px-2">
            {posts?.map((post) => {
              if (post.image) {
                post.image = post.image.split("djna5slqw").join("daxbi6fhs");
              }
              return (
                <div
                  key={post._id}
                  className="h-52 w-full mt-5 profile-post-img relative"
                >
                  {post.image ? (
                    <div className="h-52">
                      <Link href={`/p/${post._id}`}>
                        {post.image.endsWith(".mp4") ||
                        post.image.endsWith(".mkv") ? (
                          <video
                            className="object-cover w-full h-full rounded-md"
                            src={post.image}
                            autoPlay={false}
                            preload="auto"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            className="rounded-md h-full w-screen object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            src={post.image}
                            alt={post.title || "Post"}
                          />
                        )}
                      </Link>
                    </div>
                  ) : (
                    <div className="h-52">
                      <Link href={`/p/${post._id}`}>
                        <img
                          className="rounded-md h-full w-screen object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          src={"/placeholder.svg"}
                          alt={post.title || "Post"}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
