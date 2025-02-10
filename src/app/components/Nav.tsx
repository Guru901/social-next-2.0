"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";
import { useUserStore } from "@/stores/userStore";
import {
  Settings,
  Home,
  Search,
  Plus,
  LogOut,
  User,
  Users,
  Folder,
  Bell,
} from "lucide-react";

const Nav = () => {
  const [showNav, setShowNav] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const { error, user } = useGetUser();
  const { setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (showNav) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showNav]);

  // Handle clicks outside menus
  useEffect(() => {
    const handleClick = (e) => {
      if (
        showNav &&
        !e.target.closest("#mobile-nav") &&
        !e.target.closest(".menu-trigger")
      ) {
        setShowNav(false);
      }
      if (
        showDropDown &&
        !e.target.closest("#user-dropdown") &&
        !e.target.closest("#user-avatar")
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showNav, showDropDown]);

  const navItems = [
    {
      title: "Home",
      icon: <Home size={20} strokeWidth={2} />,
      path: "/feed",
    },
    {
      title: "Search",
      icon: <Search size={20} strokeWidth={4} />,
      path: "/search",
    },
    {
      title: "Post",
      icon: <Plus size={20} strokeWidth={4} />,
      path: "/post",
    },
    {
      title: "Create Topic",
      icon: <Plus size={20} strokeWidth={4} />,
      path: "/createTopic",
    },
    {
      title: "All Topics",
      icon: <Folder size={20} strokeWidth={4} />,
      path: "/alltopics",
    },
  ];

  const dropDownMenu = [
    {
      title: "Friends",
      path: "/friends",
      icon: <Users size={20} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
    {
      title: "Logout",
      path: "",
      icon: <LogOut size={20} />,
    },
  ];

  const logOut = async () => {
    setUser({
      _id: "",
      username: "",
      avatar: "",
      friends: [],
      isFriendsWith: [],
    });
    // await axios.get(d"/api/user/logout");
    router.push("/login");
  };

  if (error && error !== "User not logged in") return <div>Error: {error}</div>;

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-[#0A1120] shadow-lg h-12 py-10 z-50">
        <div className="mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <button
              className="menu-trigger touch-manipulation p-2 ml-2 cursor-pointer"
              onClick={() => setShowNav(!showNav)}
              aria-label="Menu"
            >
              {showNav ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <Link prefetch={true} href="/post" className="touch-manipulation">
                <button className="p-2 cursor-pointer">
                  <Plus size={28} strokeWidth={4} />
                </button>
              </Link>
              <Link
                href="/notifications"
                prefetch={true}
                className="touch-manipulation"
              >
                <button className="p-2 cursor-pointer">
                  <Bell className="fill-current" size={26} />
                </button>
              </Link>
              <button
                id="user-avatar"
                className="touch-manipulation relative flex items-center p-2 cursor-pointer"
                onClick={() => setShowDropDown(!showDropDown)}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden">
                  {user?.avatar ? (
                    <Image
                      width={56}
                      height={56}
                      src={user.avatar}
                      className="object-cover"
                      alt="avatar"
                      priority={true}
                      loading="eager"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showNav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-hidden="true"
          onClick={() => setShowNav(false)}
        />
      )}

      <nav
        id="mobile-nav"
        className={`border mt-5 rounded-lg border-gray-200 fixed top-16 left-0 bottom-0 w-64 bg-[#0A1120] transform transition-transform duration-300 ease-in-out z-40 ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "calc(100% - 64px)" }}
      >
        <div className="overflow-y-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setShowNav(false)}
              prefetch={true}
            >
              <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#181e23] active:bg-[#181e23] touch-manipulation">
                {item.icon}
                <span className="text-xl font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Dropdown Menu */}
      {showDropDown && (
        <div
          id="user-dropdown"
          className="fixed right-4 top-16 w-60 border border-gray-200/35 shadow-2xl bg-[#0A1120] rounded-lg z-50 overflow-hidden"
        >
          <Link
            prefetch={true}
            href="/profile"
            className="touch-manipulation"
            onClick={() => setShowDropDown(false)}
          >
            <div className="p-4 hover:bg-[#181e23] active:bg-[#181e23]">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <Image
                      width={64}
                      height={64}
                      src={user.avatar}
                      className="object-cover"
                      alt="avatar"
                      priority={true}
                      loading="eager"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate">View Profile</div>
                  <div className="text-sm opacity-75 truncate">
                    {user?.username}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {dropDownMenu.map((item) => (
            <div key={item.title} className="touch-manipulation">
              {item.title === "Logout" ? (
                <button
                  onClick={() => {
                    setShowDropDown(false);
                    logOut();
                  }}
                  className="w-full text-left p-4 hover:bg-[#181e23] active:bg-[#181e23] flex items-center gap-3"
                >
                  {item.icon}
                  <span className="text-xl font-semibold">{item.title}</span>
                </button>
              ) : (
                <Link
                  prefetch={true}
                  href={item.path}
                  onClick={() => setShowDropDown(false)}
                >
                  <div className="p-4 hover:bg-[#181e23] active:bg-[#181e23] flex items-center gap-3">
                    {item.icon}
                    <span className="text-xl font-semibold">{item.title}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Nav;
