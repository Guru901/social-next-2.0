import type { AppRouter } from "@/server";
import { createClient } from "jstack";

export const client = createClient<AppRouter>({
  baseUrl: `${getBaseUrl()}/api`,
});

function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "https://social-next-noice.vercel.app";
  }
  return `http://localhost:3000`;
}
