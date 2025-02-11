import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function clientAuth() {
  const cookie = await cookies();
  const token = cookie.get("token");

  if (!token) {
    redirect("/login");
  }

  const { id } = jwt.decode(token.value) as { id: string };

  return { userId: id };
}
