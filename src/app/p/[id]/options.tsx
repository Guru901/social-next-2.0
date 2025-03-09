import { client } from "@/lib/client";
import {
  handleDisLike,
  handleDisUnlike,
  handleLike,
  handleUnLike,
} from "@/lib/likeUtils";
import { useUserStore } from "@/stores/userStore";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CopyToast() {
  return (
    <div className="toast toast-center">
      <div className="alert alert-info">
        <span>Link copied to clipboard</span>
      </div>
    </div>
  );
}

export function Options({ post, setPost, refetch }) {
  const { user } = useUserStore();
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);

  const deletePost = async () => {
    const res = await client.post.delete.$post({
      postId: post._id,
    });

    const data = await res.json();

    if (data.success) {
      router.push("/feed");
    }
  };

  const like = async (id: string) => {
    try {
      await handleLike(id, () => {});
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        likes: [...(prevPost?.likes || []), user?._id],
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const unLike = async (id: string) => {
    try {
      handleUnLike(id, () => {});
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        likes: prevPost?.likes?.filter((like) => like !== user?._id),
      }));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const disLike = async (id: string) => {
    try {
      handleDisLike(id, () => {});
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        dislikes: [...(prevPost?.dislikes || []), user?._id],
      }));
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const disUnLike = async (id: string) => {
    try {
      handleDisUnlike(id, () => {});
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        dislikes: prevPost?.dislikes?.filter(
          (dislike) => dislike !== user?._id,
        ),
      }));
    } catch (error) {
      console.error("Error removing dislike from post:", error);
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex gap-4  p-2 rounded-xl">
      <div className="flex items-center gap-1">
        {user && post?.likes?.includes(user?._id) ? (
          <div className="flex items-center justify-center gap-1">
            <ThumbsUp
              size={28}
              onClick={() => unLike(post._id)}
              className="cursor-pointer fill-current"
            />
            <h1 className="text-xl">{post?.likes?.length}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <ThumbsUp
              size={28}
              onClick={() => like(post._id)}
              className="cursor-pointer"
            />
            <h1 className="text-xl">{post?.likes?.length}</h1>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1  mt-1">
        {user && post?.dislikes?.includes(user?._id) ? (
          <div className="flex items-center justify-center gap-2">
            <ThumbsDown
              size={28}
              onClick={() => disUnLike(post._id)}
              className="cursor-pointer fill-current"
            />
            <h1 className="text-xl">{post?.dislikes?.length}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ThumbsDown
              size={28}
              onClick={() => disLike(post._id)}
              className="cursor-pointer"
            />
            <h1 className="text-xl">{post?.dislikes?.length}</h1>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-neutral rounded-lg flex items-center justify-center h-10 py-0 min-h-10"
          onClick={copyUrlToClipboard}
        >
          Share
        </button>
        {post?.user._id === user?._id && (
          <div>
            <label
              htmlFor="my_modal_6"
              className="btn btn-neutral min-h-10 h-10"
              // @ts-ignore
              onClick={() => document.getElementById("my_modal_1")?.showModel()}
            >
              Delete Post
            </label>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />

            <div role="dialog" className="modal">
              <div className="modal-box">
                <p className="py-4">
                  Are you sure you want to delete this post
                </p>
                <div className="modal-action flex">
                  <button className="btn" onClick={deletePost}>
                    Yes
                  </button>
                  <form method="dialog">
                    <button
                      className="btn"
                      onClick={() =>
                        // @ts-ignore
                        (document.getElementById("my_modal_6")!.checked = false)
                      }
                    >
                      No
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showToast && <CopyToast />}
      </div>
    </div>
  );
}
