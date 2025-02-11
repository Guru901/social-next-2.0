import { client } from "@/lib/client";
import { redirect } from "next/navigation";

export async function createTopic(formData: FormData) {
  const title = String(formData.get("title"));

  const res = await client.topic.createTopic.$post({
    name: title,
  });
  const { success, msg } = await res.json();
  if (success) {
    redirect("/feed");
  } else {
    throw new Error(msg);
  }
}
