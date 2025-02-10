"use client";

import React, { useState } from "react";
import Nav from "@/app/components/Nav";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loading";
import Link from "next/link";
import { client } from "@/lib/client";

export default function Search() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const { isError, error, isLoading } = useQuery({
    queryKey: [search],
    queryFn: async () => {
      if (!search.trim()) return [];
      const res = await client.user.search.$get({
        search: search,
      });
      const users = (await res.json()).users;
      setUsers(users);
      return users;
    },
    enabled: Boolean(search.trim()),
  });

  const { isLoading: isLoading2 } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await client.user.getAllUsers.$get();
      const users = (await res.json()).users;
      setUsers(users);
      return users;
    },
  });

  if (isError) {
    console.error(error);
    return (
      <div>Some error occured if u are the dev see this : {error.message}</div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Nav />
      <div className="max-w-96 flex flex-col items-center py-5 gap-2">
        <h1 className="flex text-2xl font-medium">
          Find what you're looking for
        </h1>
        <div className="w-screen flex justify-center mt-4"></div>
        <div className="flex flex-col gap-4">
          <form>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-[calc(100vw-2rem)]"
              onChange={(e) => setSearch(String(e.target.value))}
            />
          </form>
          {isLoading || isLoading2 ? (
            <Loader />
          ) : (
            <div className="w-[calc(100vw-2rem)] flex flex-col gap-2">
              {Array.isArray(users) &&
                users.map((user) => (
                  <div
                    className="card w-full bg-base-100 shadow-xl"
                    key={user._id}
                  >
                    <Link href={`/u/${user._id}`}>
                      <div className="card-body flex flex-row p-4 gap-8">
                        {user.avatar ? (
                          <div className="h-16 w-16 rounded-full overflow-hidden">
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-white"></div>
                        )}
                        <div className="card-title">{user.username}</div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
