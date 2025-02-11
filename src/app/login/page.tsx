import React from "react";
import LoginForm from "./form";

export default function Login() {
  return (
    <div className="flex flex-col w-[100svw] h-[100svh] justify-around items-center px-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  );
}
