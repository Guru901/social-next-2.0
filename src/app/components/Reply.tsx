import { getDateDifference } from "@/lib/getDateDifference";
import { User } from "lucide-react";
import Link from "next/link";

type Comments = {
  _id: string;
  text: string;
  avatar: string;
  createdAt: string;
  user: string;
  image?: string;
  isAReply?: boolean;
  replies: string[];
};

export function Reply({ comment }: { comment: Comments }) {
  const username = comment?.user.replace(" ", "_");

  if (comment.image) {
    comment.image = comment.image.split("djna5slqw").join("daxbi6fhs");
  }

  return (
    <div
      className="flex flex-col border-solid border-white p-2 gap-4 items-center justify-start relative"
      key={comment?._id}
    >
      <div className="flex border-solid border-white p-2 gap-4 items-start justify-start w-full">
        <div className="flex h-full items-start pt-2">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            {comment?.avatar ? (
              <img
                src={comment?.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full">
                <User size={60} />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm underline text-[#888] break-words text-nowrap">
                <Link href={`/u/${username}`}>
                  @{comment?.user ? comment?.user : "Ni Batu :)"}
                </Link>
              </h1>
              <p className="font-bold">·</p>
              <h1 className="text-[12px] font-semibold text-zinc-500 text-nowrap">
                {getDateDifference(comment?.createdAt)}
              </h1>
            </div>
          </div>
          <div className="break-words mr-2 md:mr-0">
            {comment?.text.split(" ").map((x) =>
              x.startsWith("@") ? (
                <Link
                  className="text-primary underline"
                  href={`/u/${x.slice(1)}`}
                >
                  <span>{x + " "}</span>
                </Link>
              ) : (
                <span>{x + " "}</span>
              )
            )}
          </div>
        </div>
      </div>
      {comment.image && (
        <div className="md:max-w-[28rem] flex justify-end">
          {comment.image &&
            (comment.image.endsWith(".mp4") ||
            comment.image.endsWith(".mkv") ? (
              <video
                className="w-full max-w-sm rounded-md"
                src={comment.image}
                controls
                autoPlay={false}
              />
            ) : (
              <img
                src={comment.image}
                alt="comment image"
                className="max-w-sm w-full object-cover rounded-md"
              />
            ))}
        </div>
      )}
    </div>
  );
}
