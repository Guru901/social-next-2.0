"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { client } from "@/lib/client";
import { Bell, Feather, SettingsIcon, User } from "lucide-react";

export default function Settings() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const logOut = async () => {
    await client.user.logout.$get();
    setUser(null);
    router.push("/login");
  };

  const settingsItems = [
    {
      title: "Edit Profile",
      desc: "still can't change username",
      icon: <User />,
      link: "/settings/profile",
    },
    {
      title: "Change Password",
      desc: "still can't change username",
      icon: <User />,
      link: "/settings/change__password",
    },
    {
      title: "Account",
      icon: <SettingsIcon />,
      link: "/settings/account",
    },
    {
      title: "Notifications",
      icon: <Bell />,
      link: "/settings/account",
    },
    {
      title: "Give Feedback",
      icon: <Feather />,
      desc: "Ni diya to bhoot le jaayege",
      link: "/settings/feedback",
    },
    {
      title: "Logout",
      icon: <SettingsIcon />,
    },
  ];
  return (
    <div>
      <div className="settings flex gap-2 flex-col">
        {settingsItems?.map((item) => (
          <div className="setting flex flex-row p-4 gap-8" key={item.title}>
            {item.link ? (
              <Link href={item?.link} key={item.title}>
                <div className="card-title flex justify-start items-center gap-4 cursor-pointer">
                  <div>{item?.icon}</div>
                  <div className="flex flex-col">
                    <div className="mt-1">{item.title}</div>
                    <p className="text-xs">{item?.desc}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className="card-title flex justify-start items-center gap-4 cursor-pointer"
                onClick={logOut}
              >
                <div>{item?.icon}</div>
                <div className="flex flex-col">
                  <div className="mt-1">{item.title}</div>
                  <p className="text-xs">{item?.desc}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
