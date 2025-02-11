import React from "react";
import Nav from "@/app/components/Nav";
import { client } from "@/lib/client";
import Notifications from "./notifications";

export default async function NotificationsPage() {
  const { notifications } = await (
    await client.user.getNotifications.$get()
  ).json();
  return (
    <div>
      <Nav />
      <div>
        <Notifications notifications={notifications} />
      </div>
    </div>
  );
}
