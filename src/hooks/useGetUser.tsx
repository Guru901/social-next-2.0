"use client";

import { client } from "@/lib/client";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function useGetUser() {
  const { user, setUser } = useUserStore();
  const [error, setError] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const res = await client.user.me.$get();
          const data = await res.json();
          if (data.success === false) {
            if (data.user === null) {
              location.reload();
              return;
            }

            setError("User not logged in");
            return;
          }

          setUser(data.user);
        } catch (error) {
          setError("error in getLoggedInUser");
          alert("Please login again");
          push("/login");
        }
      };

      fetchUser();
    }
  }, []);

  return { user, error };
}
