"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/schemas";
import { z } from "zod";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const [avatar, setAvatar] = useState<string>();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.user.register.$post(data);
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
    <form onSubmit={onSubmit} className="flex flex-col w-full max-w-sm gap-3">
      <div>
        <input
          type="text"
          placeholder="Enter Your Username.."
          {...register("username")}
          className="input input-bordered w-full"
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
      <div>
        <input
          type="password"
          placeholder="Confirm Password.."
          className="input input-bordered w-full"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <CldUploadWidget
        uploadPreset="social-nextest"
        onSuccess={(results) => {
          // @ts-ignore
          const secureUrl = results.info.secure_url;
          setAvatar(secureUrl);
          setValue("avatar", secureUrl);
        }}
      >
        {({ open }) => {
          return (
            <button type="button" onClick={() => open()} className="btn">
              {avatar ? "Change Avatar" : "Select Avatar"}
            </button>
          );
        }}
      </CldUploadWidget>
      {errors.avatar && (
        <p className="text-xs text-red-500">{errors.avatar.message}</p>
      )}
      <div className="flex flex-col text-xs gap-1">
        <h1>Remember you cant ever change the username</h1>
        <Link href={"/"} className="underline">
          Learn more
        </Link>
        <Link href={"/login"} className="underline">
          Already have an account?
        </Link>
      </div>
      {errors.root && (
        <p className="text-xs text-red-500">{errors.root.message}</p>
      )}
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
