import { z } from "zod";
import auth from "../helper/auth";
import { j, publicProcedure } from "../jstack";
import Post from "../models/postModel";
import User from "../models/userModel";
import { connectToDb } from "../db/connect";

export const postRouter = j.router({
  getUserLikedPosts: publicProcedure.query(async ({ c }) => {
    await connectToDb();
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

  getAllPosts: publicProcedure
    .input(
      z.object({
        keyWord: z.string().default("general"),
      })
    )
    .query(async ({ c, input }) => {
      await connectToDb();
      const { success } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg: "User not logged in",
          posts: [],
        });
      }

      const { keyWord } = input;

      const posts = await Post.find({
        isPublic: true,
        topic: keyWord.toLowerCase() || "",
      }).populate("user", "username avatar");

      return c.json({
        success: true,
        msg: "Posts found",
        posts,
      });
    }),

  getFriendsPost: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const { success, user, msg } = auth(c);
    if (!success) {
      return c.json({
        success: false,
        msg,
        posts: [],
      });
    }
    const loggedInUser = await User.findById(user);

    const friends = loggedInUser.friends;

    const posts = [];

    for (let i = 0; i < friends.length; i++) {
      const friend = friends[i];

      const post = await Post.find({ user: friend, topic: "general" }).populate(
        "user",
        "username avatar"
      );

      for (let p = 0; p < post.length; p++) {
        posts.push(post[p]);
      }
    }

    return c.json({
      success: true,
      msg: "Posts found",
      posts,
    });
  }),

  getPublicPosts: publicProcedure.query(async ({ c }) => {
    await connectToDb();
    const posts = await Post.find({ isPublic: true }).populate(
      "user",
      "username avatar"
    );

    return c.json({
      success: true,
      msg: "Posts found",
      posts,
    });
  }),

  like: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post liked",
        post,
      });
    }),

  unlike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post unliked",
        post,
      });
    }),

  dislike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $addToSet: { dislikes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post disliked",
        post,
      });
    }),

  disunlike: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, input }) => {
      await connectToDb();
      const { success, user, msg } = auth(c);
      if (!success) {
        return c.json({
          success: false,
          msg,
          posts: [],
        });
      }

      const { id } = input;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { dislikes: user },
        },
        { new: true }
      );

      return c.json({
        success: true,
        msg: "Post disunliked",
        post,
      });
    }),
});
