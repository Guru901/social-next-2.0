"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/app/components/Loader";
import Nav from "@/app/components/Nav";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PostCard from "@/app/components/PostCard";
import { FetchOptions } from "./options";
import { client } from "@/lib/client";
import { Loader2 } from "lucide-react";

export default function Feed() {
  const [selectedOption, setSelectedOption] = useState("general");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>(null);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  const params = useSearchParams();

  useEffect(() => {
    setPosts([]);
  }, [selectedOption]);

  useEffect(() => {
    if (params.get("from") === "post") {
      refetch();
    }
  }, [params]);

  const { isLoading, refetch, isError, error } = useQuery({
    queryKey: ["posts", selectedOption, page],
    queryFn: async () => {
      let data;
      if (selectedOption === "general") {
        const res = await client.post.getAllPosts.$get({
          keyWord: "general",
          page,
        });
        const { posts } = await res.json();
        data = posts;
      } else if (selectedOption === "friends") {
        const res = await client.post.getFriendsPost.$get({
          page,
        });
        const { posts } = await res.json();
        data = posts;
      } else if (selectedOption === "all_posts") {
        const res = await client.post.getPublicPosts.$get({
          page,
        });
        const { posts } = await res.json();
        data = posts;
      }

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
      return data;
    },
  });

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading || posts.length === 0 || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    },
    [isLoading, posts.length, hasMore],
  );

  if (isError) {
    return <div>Error occured: {error.message}</div>;
  }

  if (isLoading && page === 1) return <Loader />;

  return (
    <>
      <div className="flex justify-center">
        <Nav />
      </div>
      <div className="mt-6">
        <div className="mt-2 flex w-screen md:justify-start items-center px-6 md:px-14">
          <FetchOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
        {window && window.innerWidth < 768 ? (
          <div className="flex feedContainer flex-col md:flex-row flex-wrap  justify-center items-center gap-5 py-6 px-2 md:p-14 pb-16 w-screen">
            {posts?.map((post, index) => {
              if (posts.length === index + 1) {
                return (
                  <PostCard
                    ref={lastPostRef}
                    key={`${post._id}-${index}`}
                    post={post}
                    refetch={refetch}
                  />
                );
              } else {
                return (
                  <PostCard
                    key={`${post._id}-${index}`}
                    post={post}
                    refetch={refetch}
                  />
                );
              }
            })}
            {hasMore && (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 py-6 px-2 md:p-14 pb-16 w-screen">
              <div className="space-y-4">
                {posts
                  ?.filter((_, index) => index % 2 === 0)
                  .map((post, index) => {
                    return (
                      <PostCard
                        ref={
                          index === Math.floor(posts.length / 2) &&
                          posts.length % 2 === 0
                            ? lastPostRef
                            : null
                        }
                        key={`${post._id}-${index}`}
                        post={post}
                        refetch={refetch}
                      />
                    );
                  })}
              </div>
              <div className="space-y-4">
                {posts
                  ?.filter((_, index) => index % 2 !== 0)
                  .map((post, index) => (
                    <PostCard
                      ref={
                        index === Math.floor((posts.length - 1) / 2)
                          ? lastPostRef
                          : null
                      }
                      key={`${post._id}-${index}`}
                      post={post}
                      refetch={refetch}
                    />
                  ))}
              </div>
            </div>
            {hasMore && page !== 1 && (
              <div className="flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" />
                Loading more posts...
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
