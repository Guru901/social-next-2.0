"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import useGetUser from "@/hooks/useGetUser";
import Loader from "@/app/loading";
import { User } from "lucide-react";
import { client } from "@/lib/client";

export default function EditProfile() {
  let { user, error } = useGetUser();
  const { setUser } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");

  const router = useRouter();

  const handleAvatarChange = async () => {
    try {
      setLoading(true);
      const res = await client.user.editAvatar.$post({ avatar });
      const data = await res.json();

      if (data.success) {
        setUser({
          ...user,
          avatar,
        });
        router.push("/profile");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error.length !== 0) {
    if (error !== "User not logged in") return <div>Error: {error}</div>;
  }
  return (
    <div>
      <Nav />
      <div className="py-6">
        <div className="max-w-screen flex items-center justify-center flex-col gap-2">
          {user?.avatar ? (
            <div className="w-52 h-52 rounded-full overflow-hidden flex justify-center items-center">
              <Image
                width={208}
                height={208}
                className="object-cover"
                src={avatar ? avatar : user?.avatar}
                alt={user?.username}
                priority={true}
                loading="eager"
              />
            </div>
          ) : (
            <div className="w-52 h-52 rounded-full overflow-hidden flex justify-center items-center">
              <User size={100} />
            </div>
          )}
          <div className="min-w-full flex justify-center flex-col items-center gap-2">
            <div className="flex gap-12">
              <CldUploadWidget
                uploadPreset="social-nextest"
                onSuccess={(results) => {
                  // @ts-ignore
                  setAvatar(results.info.secure_url);
                }}
              >
                {({ open }) => {
                  return (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="underline"
                    >
                      Change avatar
                    </button>
                  );
                }}
              </CldUploadWidget>
            </div>
            <div className="flex flex-col justify-center items-center gap-12">
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex gap-2">
                  <h1 className="text-xl">Username</h1>
                  <h1 className="font-bold text-xl">{`- ${user?.username}`}</h1>
                </div>
                <div className="flex gap-2">
                  <h1 className="text-xl">Role</h1>
                  <h1 className="font-bold text-xl">
                    {`- ${user?.username === "Phoenix" ? "Chhotu" : "User"}`}
                  </h1>
                </div>
                <button className="btn" onClick={handleAvatarChange}>
                  Confirm Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
