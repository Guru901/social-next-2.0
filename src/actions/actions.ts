"use server";

import { client } from "@/lib/client";
import clientAuth from "@/lib/client-auth";
import { redirect } from "next/navigation";

export async function createTopic(formData: FormData) {
  try {
    const title = String(formData.get("title"));
    const { userId } = await clientAuth();

    const res = await client.topic.createTopic.$post({
      name: title,
      userId,
    });
    const { success, msg } = await res.json();
    if (success) {
      redirect("/feed");
    } else {
      throw new Error(msg);
    }
  } catch (error) {
    throw new Error(error);
  }
}
