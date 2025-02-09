"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <div className="flex flex-col w-[100svw] h-[100svh] justify-around items-center px-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Welcome Back</h1>
      </div>
      <form className="flex flex-col w-full max-w-sm gap-3">
        <input
          type="text"
          placeholder="Enter Your Username.."
          className="input input-bordered w-full"
          {...register("username")}
        />

        <input
          type="password"
          placeholder="Enter Your Password.."
          className="input input-bordered w-full"
          {...register("password")}
        />

        <div className="flex flex-col text-xs gap-1">
          <Link href={"/"} className="underline">
            Learn more
          </Link>
          <Link href={"/"} className="underline">
            Dont have an account?
          </Link>
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit"}
        </button>
      </form>
    </div>
  );
}
