"use client";

import Nav from "@/app/components/Nav";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import useGetUser from "@/hooks/useGetUser";
import UserDetails from "@/app/components/UserDetails";
import Loader from "@/app/loading";
import { client } from "@/lib/client";

export default function User() {
  const [selectedOption, setSelectedOption] = useState("publicPosts");
  const [isFriend, setIsFriend] = useState(false);
  const [friendBtn, setFriendBtn] = useState("Add Friend");

  const pathName = usePathname();

  const { error, user } = useGetUser();

  const PostItems = [
    {
      label: "Public Posts",
      selectedOption: "publicPosts",
    },
    {
      label: "Private Posts",
      selectedOption: "privatePosts",
    },
    {
      label: "Liked Posts",
      selectedOption: "likedPosts",
    },
  ];

  const id = pathName.split("/")[2]; // Keeping this for path-based extraction.

  const mutation = useMutation({
    mutationKey: ["add-friends"],
    mutationFn: async () => {
      await client.user.addFriend.$post({
        from: user?.username,
        fromAvatar: user?.avatar,
        userId: userData._id,
        type: "friendAdd",
      });

      setFriendBtn("Request Sent!");
    },
  });

  const checkFriend = async () => {
    try {
      const res = await client.user.checkFriend.$get({ id });
      const data = await res.json();

      setIsFriend(data.success);
      if (data.success) {
        setFriendBtn("Friends Already");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function addFriend() {
    mutation.mutate();
  }

  useEffect(() => {
    checkFriend();
  }, [user]);

  const {
    data: userData,
    isLoading: userLoading,
    isPending: userPending,
  } = useQuery({
    queryKey: ["get-user", id],
    queryFn: async () => {
      const res = await client.user.getUserById.$get({ id });
      const data = await res.json();
      return data.user;
    },
  });

  const {
    data: posts,
    isLoading: postsLoading,
    isPending: postsPending,
  } = useQuery({
    queryKey: ["friendsPosts", selectedOption, userData?._id],
    queryFn: async () => {
      if (!user) return [];
      if (selectedOption === "likedPosts") {
        const res = await client.user.getUserLikedPosts.$get({
          id: id,
        });
        const data = await res.json();
        return data.posts.reverse();
      } else {
        const res = await client.user.getUserPosts.$post({
          id: userData._id,
          isPublic: selectedOption === "publicPosts",
        });
        const data = await res.json();
        return data.posts.reverse();
      }
    },
  });

  if (error.length !== 0) {
    if (error !== "User not logged in") return <div>Error: {error}</div>;
  }

  if (userLoading || userPending || postsLoading || postsPending)
    return <Loader />;

  return (
    <div className="flex flex-col gap-8 w-[100svw] min-h-screen">
      <Nav />
      <div>
        <div className="flex gap-8 items-center px-8"></div>
        <UserDetails
          user={userData}
          posts={posts}
          isProfile={false}
          isFriend={isFriend}
          friendBtn={friendBtn}
          addFriend={addFriend}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="divider m-0"></div>

        {isFriend && (
          <div className="flex justify-center w-[100svw] max-w-[26rem] mx-auto p-4">
            <div className="join w-[26rem]">
              {PostItems.map((postItem, index) => (
                <input
                  key={index}
                  className="join-item btn max-w-[8.66rem] w-[33%]"
                  name="options"
                  type="radio"
                  aria-label={postItem.label}
                  checked={selectedOption === postItem.selectedOption}
                  onChange={() => setSelectedOption(postItem.selectedOption)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center items-center">
          <div className="flex flex-wrap justify-start items-center gap-2 w-[26rem] px-2">
            {posts?.map((post) => {
              if (post.image) {
                post.image = post.image.split("djna5slqw").join("daxbi6fhs");
              }
              return (
                <div key={post._id} className="h-52 w-32 mt-5 profile-post-img">
                  <Link href={`/p/${post._id}`}>
                    {post.image?.endsWith(".mp4") ||
                    post.image?.endsWith(".mkv") ? (
                      <video
                        preload="auto"
                        autoPlay={false}
                        controls
                        className="object-cover w-full h-full rounded-md"
                        src={post.image}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : post.image ? (
                      <img
                        className="object-cover w-full h-full rounded-md"
                        src={post.image}
                        alt=""
                      />
                    ) : (
                      <div className="object-cover w-full h-full rounded-md border-2 border-solid border-white flex justify-center items-center text-center">
                        <h1>Post Doesn't have an image</h1>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
