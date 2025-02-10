import { useUserStore } from "@/stores/userStore";
import { ThumbsDown, ThumbsUp } from "lucide-react";
// import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CopyToast = () => {
  return (
    <div className="toast toast-center">
      <div className="alert alert-info">
        <span>Link copied to clipboard</span>
      </div>
    </div>
  );
};

export const Options = ({ post, setPost, refetch }) => {
  const { user } = useUserStore();
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);

  const deletePost = async () => {
    // const { data } = await axios.post("/api/post/delete", {
    //   id: post._id,
    // });
    // if (data.success) {
    //   router.push("/feed");
    // }
  };

  const handleLike = async (id: string) => {
    try {
      //   await axios.put("/api/likes/like", {
      //     id: id,
      //   });
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        likes: [...(prevPost?.likes || []), user?._id],
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnLike = async (id: string) => {
    try {
      //   await axios.put("/api/likes/unlike", {
      //     id: id,
      //   });
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        likes: prevPost?.likes?.filter((like) => like !== user?._id),
      }));
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleDisLike = async (id: string) => {
    try {
      //   await axios.put("/api/likes/dislike", {
      //     id: id,
      //   });
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        dislikes: [...(prevPost?.dislikes || []), user?._id],
      }));
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleDisUnlike = async (id: string) => {
    try {
      //   await axios.put("/api/likes/disunlike", {
      //     id: id,
      //   });
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        dislikes: prevPost?.dislikes?.filter(
          (dislike) => dislike !== user?._id
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
              onClick={() => handleUnLike(post._id)}
              className="cursor-pointer fill-current"
            />
            <h1 className="text-xl">{post?.likes?.length}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <ThumbsUp
              size={28}
              onClick={() => handleLike(post._id)}
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
              onClick={() => handleDisUnlike(post._id)}
              className="cursor-pointer fill-current"
            />
            <h1 className="text-xl">{post?.dislikes?.length}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ThumbsDown
              size={28}
              onClick={() => handleDisLike(post._id)}
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
                    <button className="btn">No</button>
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
};
