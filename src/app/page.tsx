import React from "react";
import RegisterForm from "./form";

export default function Register() {
  return (
    <div className="flex flex-col w-[100svw] h-[100svh] justify-evenly items-center px-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Start your Journey</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
