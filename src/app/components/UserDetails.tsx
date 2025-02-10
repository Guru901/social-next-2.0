import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import useGetUser from "@/hooks/useGetUser";
import { usePathname, useRouter } from "next/navigation";

export default function UserDetails({
  user,
  posts,
  isProfile = false,
  isFriend,
  friendBtn,
  addFriend,
}: {
  user: { username: string; avatar: string; friends: string[] } | null;
  posts: any[];
  isProfile?: boolean;
  isFriend?: boolean;
  friendBtn?: string;
  addFriend?: () => void;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const { user: userData } = useGetUser();

  if (pathName.startsWith("/u/")) {
    if (userData?.username === user.username) {
      router.push("/profile");
    }
  }

  return (
    <div className="flex gap-6 items-center justify-center relative">
      {user?.avatar ? (
        <img
          src={user?.avatar}
          className="w-screen h-72 object-cover"
          alt={user.username || "User"}
        />
      ) : (
        <div className="w-screen h-72"></div>
      )}

      <div
        className={`w-screen flex flex-col justify-center gap-10 items-center h-72 absolute ${
          user?.avatar ? "bg-[#000000]/[0.5]" : ""
        }`}
      >
        <div className="flex flex-col justify-center items-center z-10">
          <div className="flex gap-2 flex-col justify-center items-center">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                width={110}
                height={110}
                className="rounded-full"
                alt={user.username || "User"}
                priority={true}
                loading="eager"
              />
            ) : (
              <User size={70} />
            )}
            <h1 className="text-xl font-bold">
              {user?.username ? user.username : "User"}
            </h1>
          </div>
          <div className="flex gap-4">
            <div>
              <div className="flex gap-1 text-sm text-gray-200">
                <h1 className="text-center">{user?.friends?.length}</h1>
                <h1 className="text-center">Friends</h1>
              </div>
            </div>
            <div>
              <div className="flex gap-1 text-sm text-gray-200">
                <h1 className="text-center">{posts?.length}</h1>
                <h1 className="text-center">Posts</h1>
              </div>
            </div>
          </div>
        </div>
        {!isProfile && (
          <div className="flex max-w-md w-screen justify-center translate-y-[-20px] gap-2">
            {isFriend ? (
              <button className="btn" disabled>
                {friendBtn}
              </button>
            ) : (
              <button
                className="btn"
                onClick={addFriend}
                disabled={
                  friendBtn === "Friends Already" ||
                  friendBtn === "Request Sent!"
                }
              >
                {friendBtn}
              </button>
            )}
            <button className="btn mr-5" disabled={true}>
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
