"use client";

import { useSearchParams } from "next/navigation";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import PostCard from "../components/PostCard";
import Loader from "../loading";

export default function TopicPage() {
  const params = useSearchParams();

  const topicName = params.get("name");

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["topicPosts", topicName],
    queryFn: async () => {
      const res = await client.post.getTopicPost.$get({
        topicName: topicName as string,
      });
      const { posts } = await res.json();

      return posts.reverse();
    },
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <Nav />
      <div className="flex feedContainer flex-col justify-center items-center gap-5 p-6 pb-16 w-screen">
        {posts?.map((post) => (
          <PostCard post={post} refetch={refetch} key={post._id} />
        ))}
      </div>
    </div>
  );
}
