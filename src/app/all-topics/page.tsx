"use client";

import Nav from "@/app/components/Nav";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function TopicsPage() {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await client.topic.getAllTopics.$get();
      const { success, msg, topics } = await res.json();
      return topics;
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Nav />
      <div className="flex flex-wrap gap-2 justify-center">
        {topics?.map((topic) => (
          <Link
            href={`/topic?name=${topic.name.toLowerCase()}`}
            key={topic.name}
          >
            <div className="card w-[45vw] max-w-48 bg-base-100 shadow-xl image-full ">
              <div className="card-body friendCard">
                <h2 className="card-title w-full h-full flex items-end justify-center text-xl sm:text-3xl">
                  {topic.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
