import Nav from "@/app/components/Nav";
import { client } from "@/lib/client";
import Link from "next/link";
import Image from "next/image";

export default async function FriendsPage() {
  const { friendsData } = await (await client.user.getFriends.$get()).json();

  return (
    <div>
      <Nav />
      <div className="flex flex-wrap justify-center gap-3 py-5 w-[100vw]">
        {Array.isArray(friendsData) && friendsData.length > 0 ? (
          friendsData.map((friend) => (
            <Link
              href={`/u/${friend?._id}`}
              key={friend?._id}
              className="w-[90vw]"
            >
              <div className="card-body flex flex-row py-2 px-4 gap-8 shadow-xl w-full">
                {friend?.avatar ? (
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      width={64}
                      height={64}
                      src={friend.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                      priority={true}
                      loading="eager"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-white"></div>
                )}
                <div className="flex items-center justify-between">
                  <h2 className="card-title w-full flex items-end justify-center text-xl sm:text-3xl">
                    {friend?.username}
                  </h2>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>You have no friends here (also)</div>
        )}
      </div>
    </div>
  );
}
