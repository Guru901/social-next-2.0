"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Home, LogOutIcon, Settings, Upload, Users } from "lucide-react";
import { client } from "@/lib/client";

export default function Sidebar() {
  const router = useRouter();

  const { setUser } = useUserStore();

  const sideBarItemsPages = [
    {
      title: "Users",
      path: "/admin/users",
      icon: <Users size={35} />,
    },
    {
      title: "Posts",
      path: "/admin/posts",
      icon: <Upload size={35} />,
    },
  ];

  const sideBarItemsUser = [
    {
      title: "Home",
      path: "/feed",
      icon: <Home size={35} />,
    },
    {
      title: "Logout",
      path: "",
      icon: <LogOutIcon size={35} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={35} />,
    },
  ];

  const logOut = async () => {
    await client.user.logout.$get();
    setUser({});
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen bg-neutral m-1 rounded-md hidden flex-col gap-3 fixed left-1 top-0"
      id="md-flex"
    >
      <div className="flex items-center justify-center gap-4 p-2">
        <div>
          <Image
            src={
              "https://avatars.githubusercontent.com/u/133991448?s=400&u=9c79a6abb7634e20d49a9c1f5c699aa07516982f&v=4"
            }
            width={70}
            height={30}
            className="rounded-full"
            alt="avatar"
            priority={true}
            loading="eager"
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <h1 className="font-bold text-lg">Name - Gurvinder</h1>
          <h1 className="font-bold text-md">Role - Admin</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full items-start p-2">
        <h1 className="text-2xl font-bold">Pages</h1>
        {sideBarItemsPages.map((item) => (
          <Link
            key={item.path}
            className="hover:bg-[#181E23] w-full p-4 pr-40 rounded-md flex justify-start items-center gap-2"
            href={item.path}
          >
            {item.icon}
            <h1 className="font-semibold text-xl w-full text-start">
              {item.title}
            </h1>
          </Link>
        ))}
        <h1 className="text-2xl font-bold">User</h1>
        {sideBarItemsUser.map((item) => (
          <Link
            key={item.path}
            className="hover:bg-[#181E23] w-full p-4 pr-40 rounded-md flex justify-start items-center gap-2"
            href={item.path && item.path}
            onClick={item.path === "" ? logOut : undefined}
          >
            {item.icon}
            <h1 className="font-semibold text-xl w-full text-start">
              {item.title}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
