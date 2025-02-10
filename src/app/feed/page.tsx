"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";
import Nav from "@/app/components/Nav";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PostCard from "@/app/components/PostCard";
import { FetchOptions } from "./options";
import { client } from "@/lib/client";

const Feed = () => {
  const [selectedOption, setSelectedOption] = useState("general");

  const params = useSearchParams();

  useEffect(() => {
    if (params.get("from") === "post") {
      refetch();
    }
  }, [params]);

  const {
    isLoading,
    data: posts,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", selectedOption],
    queryFn: async () => {
      if (selectedOption === "general") {
        const res = await client.post.getAllPosts.$get({
          keyWord: "general",
        });
        const { posts } = await res.json();
        return posts.reverse();
      } else if (selectedOption === "friends") {
        const res = await client.post.getFriendsPost.$get();
        const { posts } = await res.json();
        return posts.reverse();
      } else if (selectedOption === "all_posts") {
        const res = await client.post.getPublicPosts.$get();
        const { posts } = await res.json();
        return posts.reverse();
      }
    },
  });

  if (isError) {
    return <div>Error occured: {error.message}</div>;
  }

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="flex justify-center">
        <Nav />
      </div>
      <div>
        <div className="mt-2 flex w-screen md:justify-start items-center px-6 md:px-14">
          <FetchOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
        {window && window.innerWidth < 768 ? (
          <div className="flex feedContainer flex-col md:flex-row flex-wrap  justify-center items-center gap-5 py-6 px-2 md:p-14 pb-16 w-screen">
            {posts?.map((post) => (
              <PostCard key={post._id} post={post} refetch={refetch} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-6 px-2 md:p-14 pb-16 w-screen">
            <div className="space-y-4">
              {posts
                ?.filter((_, index) => index % 2 === 0)
                .map((post) => (
                  <PostCard key={post._id} post={post} refetch={refetch} />
                ))}
            </div>
            <div className="space-y-4">
              {posts
                ?.filter((_, index) => index % 2 !== 0)
                .map((post) => (
                  <PostCard key={post._id} post={post} refetch={refetch} />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
