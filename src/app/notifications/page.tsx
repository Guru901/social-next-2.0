import React from "react";
import Nav from "@/app/components/Nav";
import { client } from "@/lib/client";
import Notifications from "./notifications";
import clientAuth from "@/lib/client-auth";

export default async function NotificationsPage() {
  const { userId } = await clientAuth();
  const { notifications } = await (
    await client.user.getNotifications.$get({ userId })
  ).json();

  return (
    <div>
      <Nav />
      {notifications?.length > 0 ? (
        <div>
          <Notifications notifications={notifications} />
        </div>
      ) : (
        <div className="w-[100svw] h-[80vh] flex items-center justify-center">
          <h1 className="h-min text-2xl">No Notifications</h1>
        </div>
      )}
    </div>
  );
}
