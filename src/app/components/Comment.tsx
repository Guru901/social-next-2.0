import { getDateDifference } from "@/lib/getDateDifference";
import { useUserStore } from "@/stores/userStore";
import { EllipsisVerticalIcon, User } from "lucide-react";
import Link from "next/link";
import { Reply } from "./Reply";

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

export function Comment({
  comments,
  comment,
  handleDelete,
  setReplyTo,
  inpRef,
  isReply = false,
}: {
  comments: Comments[];
  comment: Comments;
  handleDelete: (id: string) => void;
  setReplyTo: (id: string) => void;
  inpRef: React.RefObject<HTMLInputElement>;
  isReply?: boolean;
}) {
  const { user } = useUserStore();

  const username = comment?.user.replace(" ", "_");

  if (comment.image) {
    comment.image = comment.image.split("djna5slqw").join("daxbi6fhs");
  }

  return (
    !comment.isAReply && (
      <div
        className="flex flex-col border-solid border-white p-2 gap-2 items-center justify-start relative"
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
          <div className="flex flex-col w-full">
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
              <details className="dropdown dropdown-end">
                <summary className="btn btn-xs">
                  <EllipsisVerticalIcon />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
                  <li
                    onClick={() => {
                      setReplyTo(comment?._id);
                      console.log(inpRef);
                      if (inpRef.current) {
                        inpRef.current.focus();
                      }
                    }}
                  >
                    <a>Reply</a>
                  </li>
                  {user?.username === comment?.user && (
                    <li onClick={() => handleDelete(comment?._id)}>
                      <a>Delete</a>
                    </li>
                  )}
                </ul>
              </details>
            </div>
            <div className="break-words mr-2 md:mr-0 max-w-[70vw]">
              {!comment.text.includes("@") ? (
                <p>{comment.text}</p>
              ) : (
                <p>
                  {comment.text.split(" ").map((x: string, index: number) =>
                    x.startsWith("@") ? (
                      <Link
                        key={index}
                        className="text-primary underline"
                        href={`/u/${x.slice(1)}`}
                      >
                        {x + " "}
                      </Link>
                    ) : (
                      <span key={index}>{x + " "}</span>
                    )
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-screen md:max-w-96 pl-16">
          {comment.image && (
            <div className="md:max-w-[28rem] flex justify-end pr-4">
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
          <div>
            {comment.replies.map((x) => {
              const replyComment = comments.find((y) => y?._id === x);
              return <Reply comment={replyComment} key={replyComment._id} />;
            })}
          </div>
        </div>
      </div>
    )
  );
}
