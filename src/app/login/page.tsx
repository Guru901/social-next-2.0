"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.user.login.$post(data);

    const { success, msg } = await res.json();

    if (success) {
      useRouter().push("/profile");
    } else {
      setError("root", {
        message: String(msg),
      });
    }
  });

  return (
    <div className="flex flex-col w-[100svw] h-[100svh] justify-around items-center px-5">
      <div className="flex justify-between">
        <h1 className="text-3xl">Welcome Back</h1>
      </div>
      <form className="flex flex-col w-full max-w-sm gap-3" onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Your Username.."
            className="input input-bordered w-full"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter Your Password.."
            className="input input-bordered w-full"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
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
