"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.user.login.$post(data);

    const { success, msg } = await res.json();

    if (success) {
      router.push("/profile");
    } else {
      setError("root", {
        message: String(msg),
      });
    }
  });

  return (
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
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit"}
      </button>
    </form>
  );
}
