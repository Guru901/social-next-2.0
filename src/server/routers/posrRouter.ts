import auth from "../helper/auth";
import { j } from "../jstack";
import Post from "../models/postModel";

export const postRouter = j.router({
  getUserLikedPosts: j.procedure.query(async ({ c }) => {
    const { success, user, msg } = auth(c);
    if (!success) {
      return c.json({
        success: false,
        msg,
        posts: [],
      });
    }

    const post = await Post.find({
      likes: { $in: [user] },
      isPublic: true,
    });

    return c.json({
      success: true,
      msg: "Posts found",
      posts: post,
    });
  }),
});
