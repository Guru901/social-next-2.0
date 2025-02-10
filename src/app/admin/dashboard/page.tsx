"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar/sidebar";
import Posts from "../posts/page";
import Comments from "./comments/page";
import Nav from "@/app/components/Nav";
import Navbar from "./navbar/navbar";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("posts");

  const showItems = [
    {
      lable: "Posts",
      selectedOption: "posts",
    },
    {
      lable: "Comments",
      selectedOption: "comments",
    },
  ];

  return (
    <div>
      <div className="flex relative min-h-screen min-w-screen">
        <Sidebar />
        <div className="min-h-screen md:px-40 h-full"></div>
        <div className="flex flex-col gap-10">
          <div className="md:hidden">
            <Nav />
          </div>
          <div className="hidden" id="md-flex">
            <Navbar />
          </div>
          <div className="join w-[12rem] mx-2 md:hidden">
            {showItems.map((postItem) => (
              <input
                key={postItem.lable}
                className="join-item btn w-[50%] p-1 h-min"
                name="options"
                type="radio"
                aria-label={postItem.lable}
                checked={selectedOption === postItem.selectedOption}
                onChange={() => setSelectedOption(postItem.selectedOption)}
              />
            ))}
          </div>
          <div className="md:hidden">
            {selectedOption === "posts" ? <Posts /> : <Comments />}
          </div>
          <div className="hidden" id="md-flex">
            <Posts />
            <Comments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
